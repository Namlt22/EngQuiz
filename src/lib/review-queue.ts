/**
 * Hàng đợi "Ôn thẻ hôm nay" của một khoá — hàm thuần, dùng cho trang /review và số thẻ trên trang Hôm nay.
 *  - Bộ từ chuẩn (progress.srs): chỉ thẻ đã học và đến hạn (từ mới học ở trang Từ vựng).
 *  - Sổ tay: thẻ đến hạn + tối đa NEW_PER_SESSION mục chưa ôn (người học tự chọn lưu nên ôn luôn).
 *  - Hai nguồn xen kẽ để phiên không dồn một loại.
 */
import { buildNotebookQueue, type NotebookEntry } from "@/core/notebook";
import { decodeSrs } from "@/core/srs";

export type ReviewItem = { kind: "vocab"; word: string } | { kind: "notebook"; entry: NotebookEntry };

export function buildReviewQueue(srs: string | undefined, notebook: readonly NotebookEntry[], today: number): ReviewItem[] {
  const vocab: ReviewItem[] = [...decodeSrs(srs)]
    .filter(([, s]) => s.due <= today)
    .sort(([, a], [, b]) => a.due - b.due)
    .map(([word]) => ({ kind: "vocab", word }));
  const nb: ReviewItem[] = buildNotebookQueue(notebook, today).map((entry) => ({ kind: "notebook", entry }));
  const out: ReviewItem[] = [];
  for (let k = 0; k < Math.max(vocab.length, nb.length); k++) {
    if (vocab[k]) out.push(vocab[k]);
    if (nb[k]) out.push(nb[k]);
  }
  return out;
}
