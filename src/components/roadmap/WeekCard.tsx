"use client";

import Link from "next/link";
import { BookOpen, Check, ChevronDown, Headphones, Mic, PenLine, Repeat } from "lucide-react";
import { getTopicMeta } from "@/content/catalog";
import { getDictation } from "@/content/dictations";
import { IPA_MAP } from "@/content/ipa";
import { hasDictation } from "@/lib/learn";
import { PASS_PERCENT, topicStatus, type ProgressState } from "@/lib/progress";
import { getQuizSet, topicSetId } from "@/lib/quiz-sets";
import {
  SESSIONS_PER_WEEK,
  sessionKey,
  weekDateRange,
  weekProgress,
  type RoadmapLog,
  type RoadmapWeek,
} from "@/lib/roadmap";
import { roadmapActions } from "@/lib/roadmap-store";
import { PHASE_STYLES, formatSeconds } from "./labels";

interface Props {
  week: RoadmapWeek;
  log: RoadmapLog;
  progress: ProgressState;
  startDate: string;
  talkMinutes: number;
  isCurrent: boolean;
}

export function WeekCard({ week, log, progress, startDate, talkMinutes, isCurrent }: Props) {
  const style = PHASE_STYLES[week.phase - 1];
  const wp = weekProgress(week, log, progress);
  const complete = wp.sessionsDone === SESSIONS_PER_WEEK && wp.talkDone && wp.milestoneDone;

  return (
    <details open={isCurrent} className={`card group overflow-hidden ${isCurrent ? `ring-2 ${style.ring}` : ""}`}>
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 md:p-5 [&::-webkit-details-marker]:hidden">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl font-mono text-sm font-bold ${style.soft} ${style.text}`}>
          {complete ? <Check className="size-5" /> : week.n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <h3 className="font-bold">{week.title}</h3>
            {isCurrent && <span className={`chip ${style.soft} ${style.text}`}>Tuần này</span>}
            {week.review && (
              <span className="chip bg-surface-2 text-muted">
                <Repeat className="size-3" /> Củng cố
              </span>
            )}
          </div>
          <div className="text-xs text-muted">
            Tuần {week.n} · {weekDateRange(startDate, week.n)}
          </div>
        </div>
        <span className="hidden text-right text-xs font-semibold text-muted sm:block">
          {wp.sessionsDone}/{SESSIONS_PER_WEEK} buổi
          {wp.talkDone && <span className="block text-success">đã nói thật</span>}
        </span>
        <ChevronDown className="size-5 shrink-0 text-muted transition group-open:rotate-180" />
      </summary>

      <div className="space-y-5 border-t border-line p-4 md:p-5">
        <Section title="Đề tự nói">
          <ul className="space-y-1.5">
            {week.prompts.map((p) => (
              <li key={p} className="flex gap-2 text-sm">
                <Mic className={`mt-0.5 size-4 shrink-0 ${style.text}`} />
                <span lang="en">{p}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Bài trong EngQuiz (tự đánh dấu khi bạn học xong)">
          <div className="flex flex-wrap gap-2">
            {week.grammar.map((slug) => (
              <GrammarChip key={slug} slug={slug} progress={progress} />
            ))}
            {week.quizSets.map((id) => (
              <ResourceChip key={id} href={`/quiz/${id}`} icon={<PenLine className="size-3.5" />} label={getQuizSet(id)?.title ?? id} />
            ))}
            {week.dictations.map((id) => {
              const best = progress.dictations[id]?.best;
              return (
                <ResourceChip
                  key={id}
                  href={`/dictation/${id}`}
                  icon={<Headphones className="size-3.5" />}
                  label={getDictation(id)?.title ?? id}
                  done={(best ?? 0) >= PASS_PERCENT}
                  extra={best !== undefined ? `${best}%` : undefined}
                />
              );
            })}
            {week.sounds.map((id) => (
              <ResourceChip key={id} href={`/ipa#${id}`} label={`/${IPA_MAP[id]?.symbol ?? id}/`} mono />
            ))}
          </div>
        </Section>

        <Section title="Tích khi xong buổi">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: SESSIONS_PER_WEEK }, (_, i) => {
              const key = sessionKey(week.n, i + 1);
              return (
                <Toggle
                  key={key}
                  id={`s-${key}`}
                  label={`Buổi ${i + 1}`}
                  checked={!!log.sessions[key]}
                  onChange={(v) => roadmapActions.toggle("sessions", key, v)}
                  activeClass={`${style.bg} border-transparent text-white`}
                />
              );
            })}
            <Toggle
              id={`t-${week.n}`}
              label={`Nói thật ${talkMinutes} phút`}
              checked={wp.talkDone}
              onChange={(v) => roadmapActions.toggle("talks", String(week.n), v)}
              activeClass="bg-success border-transparent text-white dark:text-bg"
              dashed
            />
          </div>
        </Section>

        <label htmlFor={`m-${week.n}`} className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface-2 p-3 text-sm">
          <input
            id={`m-${week.n}`}
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
            checked={wp.milestoneDone}
            onChange={(e) => roadmapActions.toggle("milestones", String(week.n), e.target.checked)}
          />
          <span>
            <b>Cột mốc tuần {week.n}:</b> {week.milestone}
            {week.recordCheckpoint && (
              <span className="mt-1 block text-xs text-muted">
                Tuần ghi âm so sánh: nói đề “Tell me about yourself and your plans” và giữ file để nghe lại sau.
              </span>
            )}
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
          <label htmlFor={`sec-${week.n}`} className="space-y-1 text-xs font-semibold text-muted">
            <span>Giây nói liên tục (mục tiêu {formatSeconds(week.targetSeconds)})</span>
            <input
              id={`sec-${week.n}`}
              type="number"
              inputMode="numeric"
              min={0}
              max={3600}
              step={5}
              value={log.seconds[week.n] ?? ""}
              onChange={(e) => roadmapActions.setSeconds(week.n, e.target.value === "" ? undefined : Number(e.target.value))}
              className="input py-2 text-sm"
            />
          </label>
          <label htmlFor={`note-${week.n}`} className="space-y-1 text-xs font-semibold text-muted">
            <span>3 lỗi hay mắc tuần này</span>
            <textarea
              id={`note-${week.n}`}
              rows={2}
              maxLength={500}
              placeholder="vd: quên -s sau he/she, đọc thiếu âm cuối…"
              value={log.notes[week.n] ?? ""}
              onChange={(e) => roadmapActions.setNote(week.n, e.target.value)}
              className="input resize-y py-2 text-sm"
            />
          </label>
        </div>
      </div>
    </details>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h4>
      {children}
    </div>
  );
}

function GrammarChip({ slug, progress }: { slug: string; progress: ProgressState }) {
  const meta = getTopicMeta(slug);
  const status = topicStatus(progress.topics[slug], hasDictation(slug));
  return (
    <span className="inline-flex overflow-hidden rounded-full border border-line text-xs font-semibold">
      <Link
        href={`/grammar/${slug}`}
        className={`inline-flex items-center gap-1 px-2.5 py-1 hover:bg-surface-2 ${status === "done" ? "text-success" : ""}`}
      >
        {status === "done" ? <Check className="size-3.5" /> : <BookOpen className="size-3.5" />}
        {meta?.title ?? slug}
      </Link>
      <Link href={`/quiz/${topicSetId(slug)}`} className="border-l border-line px-2 py-1 text-muted hover:bg-surface-2 hover:text-fg" title="Làm quiz">
        Quiz
      </Link>
    </span>
  );
}

function ResourceChip({
  href,
  label,
  icon,
  done,
  extra,
  mono,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  done?: boolean;
  extra?: string;
  mono?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-semibold hover:bg-surface-2 ${
        done ? "text-success" : ""
      } ${mono ? "font-ipa text-sm" : ""}`}
    >
      {done ? <Check className="size-3.5" /> : icon}
      {label}
      {extra && <span className="text-muted">· {extra}</span>}
    </Link>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
  activeClass,
  dashed,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  activeClass: string;
  dashed?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex h-9 cursor-pointer select-none items-center rounded-lg border px-3 text-xs font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
        checked ? activeClass : `border-line bg-surface text-muted hover:text-fg ${dashed ? "border-dashed" : ""}`
      }`}
    >
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {checked && <Check className="mr-1 size-3.5" />}
      {label}
    </label>
  );
}
