/** Thanh mức âm lượng micro khi đang ghi (người học thấy app đang nghe mình). */
export function MicLevel({ level }: { level: number }) {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
      {[0.15, 0.3, 0.45, 0.6, 0.75].map((t) => (
        <span key={t} className={`w-1 rounded-sm transition-all ${level >= t ? "bg-primary" : "bg-line"}`} style={{ height: `${t * 100}%` }} />
      ))}
    </span>
  );
}
