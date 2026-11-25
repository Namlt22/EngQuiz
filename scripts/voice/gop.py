r"""Chấm phát âm theo câu đã biết (Goodness of Pronunciation trên mô hình CTC) — cách ELSA chấm bài đọc theo mẫu.

Khác OpenPronounce (đoán tự do người học nói âm gì rồi so chuỗi — "sheep" chuẩn vẫn có thể nghe thành /siba/):
ở đây câu đúng đã biết, nên với từng âm vị ta hỏi thẳng mô hình: bản ghi này giống câu đúng hơn, hay giống câu có âm
đó bị thay bằng âm người Việt hay đọc nhầm (/iː/→/ɪ/, /θ/→/t s f/, /v/→/b w/, bỏ phụ âm cuối…) hơn?
Đo bằng xác suất CTC của cả câu (không cần cắt ranh giới từng âm — "alignment-free GOP", xem
github.com/frank613/CTC-based-GOP và arXiv 2507.16838), trên mô hình wav2vec2-lv-60-espeak-cv-ft.

  lpr(âm) = NLL(câu có âm bị thay bằng đối thủ tốt nhất) − NLL(câu đúng)
  lpr > 0 : câu đúng khớp hơn (đọc đúng); lpr < 0 : đối thủ khớp hơn (đọc nhầm thành đối thủ).
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache

import numpy as np
import torch
import torch.nn.functional as F

os.environ.setdefault("PHONEMIZER_ESPEAK_LIBRARY", r"C:\Program Files\eSpeak NG\libespeak-ng.dll")

from openpronounce import phones  # noqa: E402
from phonemizer import phonemize  # noqa: E402
from phonemizer.separator import Separator  # noqa: E402

# Âm người Việt hay đọc nhầm thành (âm vị espeak Anh-Mỹ). "" = bỏ âm (nuốt phụ âm cuối).
CONFUSIONS: dict[str, list[str]] = {
    # Chỉ đổi độ dài (iː ↔ i, uː ↔ u) không phải lỗi gây hiểu nhầm → không làm đối thủ.
    "iː": ["ɪ"], "ɪ": ["iː", "ɛ"], "i": ["ɪ"], "uː": ["ʊ"], "ʊ": ["uː"], "u": ["ʊ"],
    "ɛ": ["æ", "eɪ", "e"], "æ": ["ɛ", "a", "ʌ"], "ʌ": ["ɑː", "æ", "a", "ɔ"], "ɑː": ["ʌ", "æ", "ɔ"], "ɑ": ["ʌ", "ɔ", "oʊ"],
    # Giọng Mỹ gộp ɔː/ɑː (caught = cot) → không coi ɑː là đọc nhầm của ɔː.
    "ɔː": ["oʊ"], "ɔ": ["oʊ"], "ɜː": ["ɛ", "ʌ", "ə"], "ɚ": ["ə", "ʌ"], "ə": ["ʌ", "ɛ"],
    "eɪ": ["ɛ", "e"], "aɪ": ["a", "æ"], "ɔɪ": ["ɔ", "oʊ"], "aʊ": ["a", "oʊ"], "oʊ": ["ɔ", "o", "ʌ"],
    "ɪɹ": ["ɛɹ", "ɪ"], "ɛɹ": ["ɛ", "ɪɹ", "eɪ"], "ʊɹ": ["uː", "ʊ"], "ɑːɹ": ["ɑː", "ʌ"], "ɔːɹ": ["ɔː", "oʊ"],
    "θ": ["t", "s", "f"], "ð": ["d", "z", "v"], "s": ["ʃ", "θ", "z"], "z": ["s", "dʒ", "ʒ"], "ʃ": ["s", "tʃ"],
    "ʒ": ["z", "ʃ", "dʒ"], "tʃ": ["ʃ", "t", "dʒ"], "dʒ": ["z", "tʃ", "ʒ"], "v": ["b", "w", "f", "j"], "f": ["p", "v"],
    "w": ["v", "u"], "p": ["b", "f"], "b": ["p", "v"], "t": ["d"], "d": ["t"], "k": ["ɡ"], "ɡ": ["k"],
    "l": ["n", "ɹ"], "ɹ": ["l", "z"], "n": ["ŋ", "l"], "ŋ": ["n"], "h": ["x"], "j": ["z"], "m": ["n"],
}
VOWELS = {"iː", "ɪ", "i", "uː", "ʊ", "u", "ɛ", "e", "æ", "ʌ", "ɑː", "ɑ", "ɔː", "ɔ", "ɜː", "ɚ", "ə", "eɪ", "aɪ", "ɔɪ", "aʊ", "oʊ",
          "ɪɹ", "ɛɹ", "ʊɹ", "ɑːɹ", "ɔːɹ", "a", "o", "ᵻ", "ɐ", "əl"}
# Từ chức năng hay đọc nhược (a → /ə/, to → /tə/, have → /həv/…): chỉ chấm phụ âm, không chấm nguyên âm.
FUNCTION_WORDS = {
    "a", "an", "the", "to", "of", "and", "or", "for", "at", "from", "as", "than", "but", "that", "some", "there",
    "can", "have", "has", "had", "was", "were", "are", "is", "be", "been", "do", "does", "will", "would", "shall",
    "me", "you", "your", "he", "she", "we", "they", "them", "him", "her", "his", "our", "us", "my", "its",
}
# Mô hình học trên nhiều thứ tiếng nên có cả nguyên âm mang thanh điệu (i5, u2, ei5… của tiếng Trung/Việt) và
# nguyên âm ngắn-căng (i, u). Giọng người Việt đọc "see" hay rơi vào i2/i5: nếu để riêng, cả /iː/ lẫn /ɪ/ đều khớp
# kém và GOP gần như đoán mò (thử espeak đọc chuẩn, giải mã tự do cũng ra "s i5"). Gộp các biến thể này vào âm
# tiếng Anh cùng chất trước khi chấm; độ dài và thanh điệu không phải lỗi gây hiểu nhầm.
MERGE: dict[str, tuple[str, ...]] = {
    "iː": ("i", "i1", "i2", "i4", "i5", "i:", "iː1", "iːː"),
    "uː": ("u1", "u2", "u4", "u5", "u:"),
    "eɪ": ("ei2", "ei5", "eiɜ"),
    "aɪ": ("ai", "ai2", "ai5", "aiɜ"),
    "aʊ": ("au", "ɑu2", "ɑu5", "ɑuɜ"),
    "oʊ": ("ou1", "ou2", "ou5", "ouɜ", "əʊ"),
    "ə": ("ə1", "ə2", "ə4", "ə5"),
    "ɑː": ("ɑ1", "ɑ2", "ɑ4", "ɑ5", "ɑɜ", "ɑ:"),
    "a": ("a1", "a2", "a4", "a5", "aɜ"),
    "o": ("o1", "o2", "o4", "o5", "oɜ", "o:"),
}
CLASS_OF = {m: rep for rep, members in MERGE.items() for m in members}
# espeak viết vài âm khác vocab của mô hình.
ESPEAK_TO_MODEL = {"ᵻ": "ɪ", "ɐ": "ə", "ɾ": "t", "ɫ": "l", "ʔ": "t"}


@dataclass(frozen=True)
class PhoneScore:
    word: str
    word_index: int
    phone: str
    lpr: float | None  # None = âm không chấm (nguyên âm từ chức năng, tên riêng…)
    heard: str  # đối thủ khớp nhất ("" = bỏ âm)


@lru_cache(maxsize=1)
def _vocab() -> tuple[dict[str, int], int]:
    vocab = phones.phone_vocab()
    processor, _ = phones._load_model()
    return {t: i for i, t in enumerate(vocab)}, processor.tokenizer.pad_token_id


@lru_cache(maxsize=2048)
def expected_phones(text: str) -> tuple[tuple[str, tuple[str, ...]], ...]:
    """[(từ, (âm vị…)), …] theo espeak Anh-Mỹ, đã đổi sang ký hiệu của mô hình."""
    words = ["".join(c for c in w if c.isalpha() or c == "'") for w in text.replace("—", " ").split()]
    words = [w for w in words if w]
    ids, _ = _vocab()
    # Phiên âm cả câu một lượt (espeak đọc theo ngữ cảnh), tách lại theo từ; lệch số từ thì phiên âm từng từ.
    joined = phonemize(" ".join(words), language="en-us", backend="espeak", separator=Separator(phone=" ", word=" | "), strip=True, with_stress=False)
    groups = [g.split() for g in joined.split("|")]
    if len(groups) != len(words):
        groups = [phonemize(w, language="en-us", backend="espeak", separator=Separator(phone=" ", word=" | "), strip=True, with_stress=False).replace("|", " ").split() for w in words]
    out = []
    for w, g in zip(words, groups):
        seq = [ESPEAK_TO_MODEL.get(p, p) for p in g]
        out.append((w, tuple(p for p in seq if p in ids)))
    return tuple(out)


def _nll(log_probs: torch.Tensor, seqs: list[list[int]], blank: int) -> np.ndarray:
    """−log P(chuỗi | âm thanh) theo CTC cho nhiều chuỗi cùng lúc."""
    T = log_probs.shape[0]
    n = len(seqs)
    lp = log_probs.unsqueeze(1).expand(T, n, -1)
    targets = torch.tensor([t for s in seqs for t in s], dtype=torch.long)
    lengths = torch.tensor([len(s) for s in seqs], dtype=torch.long)
    loss = F.ctc_loss(lp, targets, torch.full((n,), T, dtype=torch.long), lengths, blank=blank, reduction="none", zero_infinity=True)
    return loss.numpy()


def score_text(log_post: np.ndarray, text: str, only_word: str | None = None, skip_words: frozenset[str] = frozenset()) -> list[PhoneScore]:
    """GOP từng âm vị của `text` (hoặc chỉ của từ `only_word`) trên log posterior (khung × vocab) của mô hình.

    Trả về mọi âm của các từ được xét (để hiển thị đủ); âm không chấm có lpr None. `skip_words`: từ chỉ hiển thị,
    không chấm (tên riêng Việt Nam — giọng mẫu đọc theo cách viết lại, vd Linh → "Ling").
    """
    ids, blank = _vocab()
    words = expected_phones(text)
    flat: list[tuple[int, str, str]] = [(wi, w, p) for wi, (w, ph) in enumerate(words) for p in ph]
    canon = [ids[CLASS_OF.get(p, p)] for _, _, p in flat]
    if not canon:
        return []
    variants: list[list[int]] = [canon]
    owners: list[tuple[int, str]] = []
    for k, (_, w, p) in enumerate(flat):
        if only_word and w.lower() != only_word.lower():
            continue
        if w.lower() in skip_words or (p in VOWELS and w.lower() in FUNCTION_WORDS):
            continue
        rivals = list(CONFUSIONS.get(p, []))
        if p not in VOWELS and w.lower() not in FUNCTION_WORDS:
            rivals.append("")  # bỏ phụ âm (người Việt hay nuốt âm cuối); từ chức năng nói nhanh vẫn được lược âm
        for r in rivals:
            r = CLASS_OF.get(r, r)
            if r and (r not in ids or ids[r] == canon[k]):
                continue
            seq = canon[:k] + ([ids[r]] if r else []) + canon[k + 1:]
            if seq:
                variants.append(seq)
                owners.append((k, r))
    nll = _nll(merged(log_post), variants, blank)
    best: dict[int, tuple[float, str]] = {}
    for (k, r), v in zip(owners, nll[1:]):
        lpr = float(v - nll[0])
        if k not in best or lpr < best[k][0]:
            best[k] = (lpr, r)
    return [
        PhoneScore(
            word=w, word_index=wi, phone=p,
            lpr=round(best[k][0], 2) if k in best else None,
            heard=best[k][1] if k in best else "",
        )
        for k, (wi, w, p) in enumerate(flat)
        if not only_word or w.lower() == only_word.lower()
    ]


@lru_cache(maxsize=1)
def _merge_groups() -> tuple[tuple[int, tuple[int, ...]], ...]:
    ids, _ = _vocab()
    return tuple((ids[rep], tuple(ids[m] for m in members if m in ids)) for rep, members in MERGE.items() if rep in ids)


def merged(log_post: np.ndarray) -> torch.Tensor:
    """Log posterior với các biến thể trong MERGE cộng dồn (logsumexp) vào âm đại diện; cột biến thể bị tắt."""
    lp = torch.from_numpy(log_post).float().clone()
    src = lp.clone()
    for rep, members in _merge_groups():
        cols = [rep, *members]
        lp[:, rep] = torch.logsumexp(src[:, cols], dim=-1)
        lp[:, list(members)] = -1e4
    return lp


def canonical_nll(log_post: np.ndarray, text: str) -> float:
    """−log P(câu đúng | âm thanh): càng nhỏ càng khớp — dùng để đoán người học đã đọc câu nào."""
    ids, blank = _vocab()
    seq = [ids[CLASS_OF.get(p, p)] for _, ph in expected_phones(text) for p in ph]
    return float(_nll(merged(log_post), [seq], blank)[0]) if seq else float("inf")


def free_phones(log_post: np.ndarray) -> str:
    """Chuỗi âm mô hình nghe được khi không biết trước câu (giải mã tham lam) — chỉ để ghi log chẩn đoán."""
    _, blank = _vocab()
    vocab = phones.phone_vocab()
    best = log_post.argmax(axis=-1)
    out = [vocab[t] for k, t in enumerate(best) if t != blank and (k == 0 or t != best[k - 1])]
    return " ".join(out)


def log_posteriors(wave: np.ndarray, sr: int = 16_000) -> np.ndarray:
    return phones.phone_log_posteriors(wave, sr)
