/**
 * File âm đứng riêng cho 44 âm IPA (public/audio/ipa/<id>-h2.mp3), giọng người từ Wikimedia Commons;
 * riêng /ŋ/ cắt từ "sing" do Kokoro đọc, vì không bản ghi người nào cắt ra đạt khi nghe thử.
 *
 * - "vowel": đoạn giữa ổn định của bản ghi nguyên âm, đặt độ dài theo âm ngắn / dài.
 * - "word-end": nguyên âm đôi lấy từ một từ kết thúc bằng âm đó, đã bỏ phụ âm đầu.
 * - "consonant": đoạn phụ âm cắt từ một từ và được chọn bằng tai; /d dʒ f θ ð h/ giữ nguyên cụm "phụ âm + ơ nhẹ" ở đầu từ.
 * Mọi file đã cắt, đổi sang mp3 mono và cân cùng mức âm lượng. Hậu tố -h2 / -h3 / -h4 để trình duyệt không dùng bản cũ đã cache.
 */

export type AudioLicense = "CC BY-SA 3.0" | "CC BY-SA 4.0" | "CC0" | "Public domain" | "Apache-2.0";

const KOKORO_URL = "https://huggingface.co/hexgrad/Kokoro-82M";

export interface IpaRecording {
  /** Trùng `IpaSound.id`. */
  id: string;
  kind: "vowel" | "word-end" | "consonant";
  /** Từ được ghi âm, nếu âm được cắt từ một từ. */
  word?: string;
  /** Tên file trên Wikimedia Commons, hoặc tên mô hình nếu âm do máy tạo. */
  file: string;
  license: AudioLicense;
  author?: string;
  /** Trang nguồn, khi không phải file trên Commons. */
  sourceUrl?: string;
}

const rec = (id: string, kind: IpaRecording["kind"], word: string | null, file: string, license: AudioLicense, author: string | null): IpaRecording => ({
  id,
  kind,
  ...(word ? { word } : {}),
  file,
  license,
  ...(author ? { author } : {}),
});

export const IPA_RECORDINGS: readonly IpaRecording[] = [
  rec("i-long", "vowel", null, "Close front unrounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("i-short", "vowel", null, "Near-close near-front unrounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("u-long", "vowel", null, "Close back rounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("u-short", "vowel", null, "Near-close near-back rounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("e", "vowel", null, "Open-mid front unrounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("schwa", "vowel", null, "Mid-central vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("er-long", "vowel", null, "Open-mid central unrounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("or-long", "vowel", null, "Open-mid back rounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("ae", "vowel", null, "Near-open front unrounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("uh", "vowel", null, "Open-mid back unrounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("a-long", "vowel", null, "Open back unrounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("o-short", "vowel", null, "Open back rounded vowel.ogg", "CC BY-SA 3.0", "Denelson83"),
  rec("ai", "word-end", "eye", "En-us-eye.ogg", "Public domain", "Muke"),
  rec("au", "word-end", "ow", "En-us-ow.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("ou", "word-end", "owe", "En-us-owe.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("ia", "word-end", "ear", "En-us-ear.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("ea", "word-end", "air", "En-us-air.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("ei", "word-end", "hay", "En-us-hay.ogg", "CC BY-SA 3.0", "Dvortybot"),
  rec("oi", "word-end", "boy", "En-us-boy.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("ua", "word-end", "tour", "En-us-tour.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("f", "consonant", "fun", "En-us-fun.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("th-voiceless", "consonant", "thumb", "En-us-thumb.ogg", "Public domain", "Dvortygirl"),
  rec("s", "consonant", null, "Voiceless alveolar sibilant.ogg", "CC BY-SA 3.0", "Peter Isotalo"),
  rec("sh", "consonant", null, "Voiceless palato-alveolar sibilant.ogg", "CC BY-SA 3.0", "Peter Isotalo"),
  rec("v", "consonant", "love", "En-us-love.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("th-voiced", "consonant", "thus", "En-us-thus.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("z", "consonant", null, "Voiced alveolar sibilant.ogg", "CC BY-SA 3.0", null),
  rec("zh", "consonant", "usually", "En-us-usually.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("m", "consonant", null, "Bilabial nasal.ogg", "CC BY-SA 3.0", null),
  rec("n", "consonant", "one", "En-us-one.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  { ...rec("ng", "consonant", "sing", "Kokoro-82M (af_heart)", "Apache-2.0", "hexgrad"), sourceUrl: KOKORO_URL },
  rec("l", "consonant", "hello", "En-us-hello.ogg", "Public domain", "Dvortygirl"),
  rec("p", "consonant", "cup", "En-us-cup.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("b", "consonant", "buzz", "En-us-buzz.ogg", "CC BY-SA 4.0", "Sylvanmoon"),
  rec("t", "consonant", "eat", "En-us-eat.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("d", "consonant", "dust", "En-us-dust.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("dj", "consonant", "just", "En-us-just.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("k", "consonant", "book", "En-us-book.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("w", "consonant", "won", "En-us-won.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("j", "consonant", "young", "En-us-young.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("r", "consonant", "run", "En-us-run.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("ch", "consonant", "each", "En-us-each.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("g", "consonant", "go", "En-us-go.ogg", "CC BY-SA 3.0", "Dvortygirl"),
  rec("h", "consonant", "hub", "En-us-hub.ogg", "CC BY-SA 4.0", "Sylvanmoon"),
];

const KIND_BY_ID = new Map(IPA_RECORDINGS.map((r) => [r.id, r.kind]));
/** Phụ âm đã được chọn lại bằng tai (file -h4). */
const PICKED_BY_EAR = new Set(["p", "b", "g", "v", "s", "z", "sh", "zh", "m", "r", "w", "j", "d", "dj", "f", "th-voiceless", "th-voiced", "h", "l", "ng"]);

/** Đường dẫn file mp3 của âm, hoặc `undefined` nếu âm này không có file. */
export function ipaAudioSrc(id: string): string | undefined {
  const kind = KIND_BY_ID.get(id);
  if (!kind) return undefined;
  const version = PICKED_BY_EAR.has(id) ? "h4" : kind === "consonant" ? "h3" : "h2";
  return `/audio/ipa/${id}-${version}.mp3`;
}

export function commonsFileUrl(file: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`;
}

/** Link ghi nguồn của một bản ghi. */
export function recordingSourceUrl(recording: IpaRecording): string {
  return recording.sourceUrl ?? commonsFileUrl(recording.file);
}

export const LICENSE_URL: Record<AudioLicense, string | undefined> = {
  "Apache-2.0": "https://www.apache.org/licenses/LICENSE-2.0",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
  "Public domain": undefined,
};
