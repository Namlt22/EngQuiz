import { Rocket } from "lucide-react";

/** Khung "Coming soon" cho tính năng đang tạm đóng (vd bán gói AI khi ENGQUIZ_SALES_OPEN tắt). */
export function ComingSoon({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <section className="card animate-pop-in mx-auto max-w-2xl space-y-4 p-8 text-center md:p-10">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
        <Rocket className="size-8" />
      </span>
      <div className="space-y-2">
        <span className="chip mx-auto bg-primary-soft text-primary">Coming soon</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
        <p className="mx-auto max-w-lg text-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}
