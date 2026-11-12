"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  FOCUS_OPTIONS,
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  MINUTE_OPTIONS,
  WEEK_OPTIONS,
  type RoadmapProfile,
} from "@/lib/roadmap";
import { todayKey } from "@/lib/progress";
import { roadmapActions } from "@/lib/roadmap-store";
import { FOCUS_LABELS, GOAL_LABELS, LEVEL_LABELS } from "./labels";

const DEFAULT_PROFILE: Omit<RoadmapProfile, "startDate"> = {
  level: "A2",
  goal: "daily",
  focus: "speaking",
  minutesPerDay: 60,
  weeks: 12,
};

interface Option<T> {
  value: T;
  title: string;
  hint?: string;
}

function ChoiceGroup<T extends string | number>({
  name,
  legend,
  options,
  value,
  onChange,
  columns = "sm:grid-cols-3",
}: {
  name: string;
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  columns?: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-bold">{legend}</legend>
      <div className={`grid grid-cols-2 gap-2 ${columns}`}>
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          const checked = o.value === value;
          return (
            <label
              key={id}
              htmlFor={id}
              className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                checked ? "border-primary bg-primary-soft" : "border-line bg-surface hover:bg-surface-2"
              }`}
            >
              <input id={id} type="radio" name={name} className="sr-only" checked={checked} onChange={() => onChange(o.value)} />
              <span className={`text-sm font-semibold ${checked ? "text-primary" : ""}`}>{o.title}</span>
              {o.hint && <span className="text-xs text-muted">{o.hint}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function RoadmapSetup({ initial, onDone }: { initial?: RoadmapProfile; onDone?: () => void }) {
  const [form, setForm] = useState<RoadmapProfile>(initial ?? { ...DEFAULT_PROFILE, startDate: todayKey() });
  const set = <K extends keyof RoadmapProfile>(key: K, value: RoadmapProfile[K]) => setForm((f) => ({ ...f, [key]: value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    roadmapActions.saveProfile(form);
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="card space-y-6 p-5 md:p-8">
      <div>
        <span className="chip bg-primary-soft text-primary">
          <Sparkles className="size-3.5" /> Lộ trình cá nhân
        </span>
        <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">{initial ? "Chỉnh lộ trình của bạn" : "Tạo lộ trình nói tiếng Anh cho riêng bạn"}</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Trả lời 6 câu hỏi. EngQuiz sẽ chia lộ trình theo tuần, ghép đúng bài lý thuyết, quiz, nghe chép và âm cần luyện, rồi tự cập nhật khi bạn học.
        </p>
      </div>

      <ChoiceGroup
        name="level"
        legend="1. Trình độ hiện tại"
        value={form.level}
        onChange={(v) => set("level", v)}
        options={LEVEL_OPTIONS.map((v) => ({ value: v, ...LEVEL_LABELS[v] }))}
      />
      <ChoiceGroup
        name="goal"
        legend="2. Bạn cần tiếng Anh để"
        value={form.goal}
        onChange={(v) => set("goal", v)}
        options={GOAL_OPTIONS.map((v) => ({ value: v, ...GOAL_LABELS[v] }))}
      />
      <ChoiceGroup
        name="focus"
        legend="3. Điểm yếu nhất"
        value={form.focus}
        onChange={(v) => set("focus", v)}
        options={FOCUS_OPTIONS.map((v) => ({ value: v, ...FOCUS_LABELS[v] }))}
      />
      <ChoiceGroup
        name="minutes"
        legend="4. Thời gian học mỗi ngày"
        value={form.minutesPerDay}
        onChange={(v) => set("minutesPerDay", v)}
        columns="sm:grid-cols-5"
        options={MINUTE_OPTIONS.map((v) => ({ value: v, title: `${v} phút` }))}
      />
      <ChoiceGroup
        name="weeks"
        legend="5. Muốn giao tiếp được sau"
        value={form.weeks}
        onChange={(v) => set("weeks", v)}
        options={WEEK_OPTIONS.map((v) => ({ value: v, title: `${v} tuần`, hint: `khoảng ${Math.round(v / 4.3)} tháng` }))}
      />

      <div className="space-y-2">
        <label htmlFor="startDate" className="text-sm font-bold">
          6. Ngày bắt đầu
        </label>
        <input
          id="startDate"
          type="date"
          required
          value={form.startDate}
          onChange={(e) => set("startDate", e.target.value)}
          className="input max-w-xs"
        />
        <p className="text-xs text-muted">Mỗi tuần gồm 6 buổi học và 1 buổi nói chuyện thật.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary">
          {initial ? "Lưu thay đổi" : "Tạo lộ trình"} <ArrowRight className="size-4" />
        </button>
        {initial && onDone && (
          <button type="button" className="btn-ghost" onClick={onDone}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
