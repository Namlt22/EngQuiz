"use client";

/**
 * Một phiên luyện đặt câu (docs/REDESIGN.md mục 5.6). Mỗi câu: gõ → Kiểm tra.
 *  - Sai lần đầu: chỉ ra từ thiếu / thừa, cho thử lại một lần (chưa lộ đáp án).
 *  - Sai lần hai hoặc bấm "Xem đáp án": hiện đáp án gần nhất, nghe được, lưu được vào Sổ tay.
 * Điểm = số câu đúng ngay lần đầu. Kết thúc bằng ActivityResult.
 */
import { useState } from "react";
import { CheckCircle2, Volume2, XCircle } from "lucide-react";
import type { SentenceSet } from "@/content/sentence-practice";
import { checkSentence, type SentenceCheck } from "@/core/sentence-practice";
import { getProgressState, PASS_PERCENT, progressActions } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { ActivityResult } from "@/components/lesson/ActivityResult";
import { SaveWordButton } from "@/components/notebook/SaveWordButton";
import { SessionHeader } from "@/components/ui/SessionHeader";

type Phase = "typing" | "retry" | "done";

/** "She lives in [Hue]." → phần trong ngoặc vuông được tô đậm (phần cần hỏi tới). */
function Given({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, k) =>
        part.startsWith("[") ? (
          <mark key={k} className="rounded bg-primary-soft px-1 font-bold text-primary">
            {part.slice(1, -1)}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function SentencePlayer({ set, listHref }: { set: SentenceSet; listHref: string }) {
  const course = set.course;
  const lang = course === "zh" ? "zh-Hans" : "en";
  const { speak } = useSpeech({ lang: course });
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [check, setCheck] = useState<SentenceCheck | null>(null);
  const [firstTry, setFirstTry] = useState<boolean[]>([]);
  const [finished, setFinished] = useState<{ correct: number; xp: number } | null>(null);

  const total = set.tasks.length;

  if (finished) {
    const percent = Math.round((finished.correct / total) * 100);
    const wrong = set.tasks.filter((_, k) => !firstTry[k]);
    return (
      <ActivityResult passed={percent >= PASS_PERCENT} percent={percent} detail={`${finished.correct}/${total}`} xp={finished.xp} onRetry={restart} next={{ label: "Bộ khác", href: listHref }}>
        {wrong.length > 0 && (
          <ul className="card divide-y divide-line text-left">
            {wrong.map((t) => (
              <li key={t.id} className="flex items-center gap-2 p-3">
                <span lang={lang} className="flex-1 font-medium">
                  {t.answers[0]}
                </span>
                <SaveWordButton entry={{ term: t.answers[0], meaning: t.prompt, source: `sentences:${set.id}` }} className="size-8" />
              </li>
            ))}
          </ul>
        )}
      </ActivityResult>
    );
  }

  const task = set.tasks[i];

  function restart() {
    setI(0);
    setTyped("");
    setPhase("typing");
    setCheck(null);
    setFirstTry([]);
    setFinished(null);
  }

  function submit() {
    if (!typed.trim()) return;
    const result = checkSentence(course, typed, task.answers);
    setCheck(result);
    if (phase === "typing") setFirstTry((f) => [...f, result.correct]);
    if (result.correct || phase === "retry") {
      setPhase("done");
      speak(result.closest, 0.9);
    } else setPhase("retry");
  }

  function reveal() {
    const result = check ?? checkSentence(course, typed, task.answers);
    if (phase === "typing") setFirstTry((f) => [...f, false]);
    setCheck({ ...result, correct: false });
    setPhase("done");
    speak(result.closest, 0.9);
  }

  function next() {
    if (i + 1 >= total) {
      const correct = firstTry.filter(Boolean).length;
      const xpBefore = getProgressState(course).xp;
      progressActions.recordSentenceSet(set.id, Math.round((correct / total) * 100), correct, total);
      setFinished({ correct, xp: getProgressState(course).xp - xpBefore });
      return;
    }
    setI(i + 1);
    setTyped("");
    setPhase("typing");
    setCheck(null);
  }

  const solved = phase === "done" && check?.correct;

  return (
    <section className="mx-auto max-w-xl space-y-5">
      <SessionHeader exitHref={listHref} value={((i + (phase === "done" ? 1 : 0)) / total) * 100} current={i + 1} total={total} />

      <div className="card space-y-4 p-5">
        <p className="text-sm font-semibold text-muted">{task.prompt}</p>
        <p lang={course === "zh" && /\p{Script=Han}/u.test(task.given) ? lang : undefined} className={course === "zh" ? "text-2xl" : "text-xl font-semibold"}>
          <Given text={task.given} />
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (phase === "done") next();
            else submit();
          }}
          className="space-y-3"
        >
          <textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            readOnly={phase === "done"}
            autoFocus
            rows={2}
            autoCapitalize="sentences"
            autoComplete="off"
            spellCheck={false}
            lang={lang}
            className="input w-full resize-none text-lg"
            aria-label="Câu của bạn"
          />

          {phase === "retry" && check && (
            <div className="space-y-1 rounded-xl bg-warning-soft px-3 py-2 text-sm" role="status">
              {check.missing.length > 0 && (
                <p>
                  Thiếu:{" "}
                  <span lang={lang} className="font-semibold">
                    {check.missing.join(course === "zh" ? "" : " · ")}
                  </span>
                </p>
              )}
              {check.extra.length > 0 && (
                <p>
                  Thừa:{" "}
                  <span lang={lang} className="font-semibold line-through">
                    {check.extra.join(course === "zh" ? "" : " · ")}
                  </span>
                </p>
              )}
              {!check.missing.length && !check.extra.length && <p>Sai thứ tự</p>}
            </div>
          )}

          {phase === "done" && check && (
            <div className={`rounded-xl px-3 py-2 ${solved ? "bg-success/10" : "bg-danger-soft"}`} role="status">
              <p className={`flex items-center gap-1.5 text-sm font-semibold ${solved ? "text-success" : "text-danger"}`}>
                {solved ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                {solved ? "Chính xác" : "Đáp án"}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <span lang={lang} className="flex-1 text-lg font-semibold">
                  {check.closest}
                </span>
                <button type="button" onClick={() => speak(check.closest, 0.9)} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg" aria-label="Nghe">
                  <Volume2 className="size-4" />
                </button>
                <SaveWordButton entry={{ term: check.closest, meaning: task.prompt, source: `sentences:${set.id}` }} className="size-8" />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {phase === "retry" && (
              <button type="button" onClick={reveal} className="btn-ghost">
                Xem đáp án
              </button>
            )}
            {phase === "done" ? (
              <button type="submit" className="btn-primary" autoFocus>
                {i + 1 >= total ? "Xem kết quả" : "Tiếp"}
              </button>
            ) : (
              <button type="submit" disabled={!typed.trim()} className="btn-primary">
                {phase === "retry" ? "Thử lại" : "Kiểm tra"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
