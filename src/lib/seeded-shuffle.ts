/**
 * Xáo theo hạt giống (id câu hỏi + lượt làm): cùng kết quả ở server và trình duyệt → không lệch hydration,
 * mà mỗi lần "Làm lại" vẫn ra thứ tự mới.
 */
export function seededShuffle<T>(arr: readonly T[], seed: string): T[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rng = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
