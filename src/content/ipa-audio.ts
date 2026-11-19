/**
 * File ghi âm đứng riêng cho từng âm IPA (public/audio/ipa/<id>.mp3).
 *
 * Nguồn: Wikimedia Commons, chuyển từ .ogg sang .mp3 (mono, cắt khoảng lặng đầu, cân bằng âm lượng).
 * Đây là bản ghi âm IPA chuẩn quốc tế, không riêng giọng Anh: không thể hiện độ dài (/iː/ và /ɪ/ dài bằng nhau),
 * âm tắc (/p/, /t/, /k/…) được đọc kèm nguyên âm /a/.
 *
 * 8 nguyên âm đôi (Commons không có bản ghi đứng riêng) và hai cặp ngắn – dài /ɪ/ – /iː/, /ʊ/ – /uː/ (bản Commons dài
 * bằng nhau, nghe gần như giống hệt): tạo bằng Kokoro-82M (Apache 2.0), giọng Anh-Mỹ "af_heart", đọc trực tiếp âm vị;
 * âm dài đọc chậm lại (~2,5 lần âm ngắn); cân âm lượng bằng các file trên — scripts/voice/generate_ipa_sounds.py.
 * Theo giọng Mỹ, ba nguyên âm đôi "hướng tâm" có âm r: /ɪə/ ≈ "here" /hɪr/, /eə/ ≈ "hair", /ʊə/ ≈ "tour".
 */

export type AudioLicense = "CC BY-SA 3.0" | "Public domain";

export interface IpaRecording {
  /** Trùng `IpaSound.id`. */
  id: string;
  /** Tên file trên Wikimedia Commons. */
  file: string;
  author?: string;
  license: AudioLicense;
}

const rec = (id: string, file: string, author?: string, license: AudioLicense = "CC BY-SA 3.0"): IpaRecording => ({
  id,
  file,
  author,
  license,
});

const DENELSON = "Denelson83";
const ISOTALO = "Peter Isotalo";

export const IPA_RECORDINGS: readonly IpaRecording[] = [
  rec("e", "Open-mid front unrounded vowel.ogg", DENELSON),
  rec("schwa", "Mid-central vowel.ogg", DENELSON),
  rec("er-long", "Open-mid central unrounded vowel.ogg", DENELSON),
  rec("or-long", "Open-mid back rounded vowel.ogg", DENELSON),
  rec("ae", "Near-open front unrounded vowel.ogg", DENELSON),
  rec("uh", "Open-mid back unrounded vowel.ogg", DENELSON),
  rec("a-long", "Open back unrounded vowel.ogg", DENELSON),
  rec("o-short", "Open back rounded vowel.ogg", DENELSON),
  rec("p", "Voiceless bilabial plosive.ogg"),
  rec("b", "Voiced bilabial plosive.ogg"),
  rec("t", "Voiceless alveolar plosive.ogg"),
  rec("d", "Voiced alveolar plosive.ogg"),
  rec("ch", "Voiceless palato-alveolar affricate.ogg", ISOTALO),
  rec("dj", "Voiced palato-alveolar affricate.ogg", "Octane (English Wikipedia)", "Public domain"),
  rec("k", "Voiceless velar plosive.ogg"),
  rec("g", "Voiced velar plosive 02.ogg"),
  rec("f", "Voiceless labiodental fricative.ogg"),
  rec("v", "Voiced labiodental fricative.ogg"),
  rec("th-voiceless", "Voiceless dental fricative.ogg"),
  rec("th-voiced", "Voiced dental fricative.ogg"),
  rec("s", "Voiceless alveolar sibilant.ogg", ISOTALO),
  rec("z", "Voiced alveolar sibilant.ogg"),
  rec("sh", "Voiceless palato-alveolar sibilant.ogg", ISOTALO),
  rec("zh", "Voiced palato-alveolar sibilant.ogg", ISOTALO),
  rec("m", "Bilabial nasal.ogg"),
  rec("n", "Alveolar nasal.ogg"),
  rec("ng", "Velar nasal.ogg"),
  rec("h", "Voiceless glottal fricative.ogg"),
  rec("l", "Alveolar lateral approximant.ogg"),
  rec("r", "Alveolar approximant.ogg", "Erutuon"),
  rec("w", "Voiced labio-velar approximant.ogg"),
  rec("j", "Palatal approximant.ogg"),
];

/** Nguyên âm đôi có file tạo bằng giọng đọc máy (Anh-Mỹ). */
export const SYNTHESIZED_DIPHTHONGS: readonly string[] = ["ia", "ei", "ua", "oi", "ou", "ea", "ai", "au"];
export const SYNTHESIZED_VOICE = "Kokoro-82M (giọng Anh-Mỹ af_heart, giấy phép Apache 2.0)";

/** Nguyên âm đơn tạo lại bằng giọng đọc máy để phân biệt rõ cặp ngắn – dài. */
export const SYNTHESIZED_VOWELS: readonly string[] = ["i-short", "i-long", "u-short", "u-long"];

const HAS_AUDIO = new Set([...IPA_RECORDINGS.map((r) => r.id), ...SYNTHESIZED_DIPHTHONGS, ...SYNTHESIZED_VOWELS]);

/** Đường dẫn file mp3 của âm, hoặc `undefined` nếu âm này không có file đứng riêng. */
/**
 * File đã thay nội dung được đặt tên mới (…-v2.mp3): /audio được cache 7 ngày (next.config), giữ tên cũ thì người học
 * quay lại vẫn nghe bản cũ.
 */
const FILE_VERSION: Readonly<Record<string, number>> = {
  "i-short": 3,
  "i-long": 3,
  "u-short": 3,
  "u-long": 3,
  ...Object.fromEntries(SYNTHESIZED_DIPHTHONGS.map((id) => [id, 2])),
};

export function ipaAudioSrc(id: string): string | undefined {
  if (!HAS_AUDIO.has(id)) return undefined;
  const v = FILE_VERSION[id];
  return `/audio/ipa/${id}${v ? `-v${v}` : ""}.mp3`;
}

export function commonsFileUrl(file: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`;
}

export const LICENSE_URL: Record<AudioLicense, string | undefined> = {
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "Public domain": undefined,
};
