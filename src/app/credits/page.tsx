/**
 * Nguồn dữ liệu & giấy phép — gom toàn bộ phần ghi công mà giấy phép yêu cầu (CC BY-SA, Arphic PL, MIT)
 * vào một trang, liên kết ở chân trang, để các trang học không phải hiện chú thích nguồn.
 */
import type { Metadata } from "next";
import { IPA_MAP } from "@/content/ipa";
import { IPA_RECORDINGS, LICENSE_URL, recordingSourceUrl } from "@/content/ipa-audio";

export const metadata: Metadata = { title: "Nguồn dữ liệu" };

const CC_BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const ext = { target: "_blank", rel: "noopener noreferrer", className: "underline hover:text-fg" } as const;

export default function CreditsPage() {
  return (
    <div className="max-w-3xl space-y-6 text-sm text-muted">
      <h1 className="text-2xl font-extrabold text-fg md:text-3xl">Nguồn dữ liệu</h1>

      <section className="card space-y-2 p-5">
        <h2 className="text-base font-bold text-fg">Từ vựng HSK và pinyin</h2>
        <p>
          Danh mục từ HSK 1–4 theo đề cương thi HSK mới (11/2025):{" "}
          <a href="https://github.com/bezlant/hsk-3-vocabulary" {...ext}>
            HSKStory
          </a>
          ; pinyin theo{" "}
          <a href="https://www.mdbg.net/chinese/dictionary?page=cedict" {...ext}>
            CC-CEDICT
          </a>
          . Giấy phép{" "}
          <a href={CC_BY_SA_4} {...ext}>
            CC BY-SA 4.0
          </a>
          .
        </p>
      </section>

      <section className="card space-y-2 p-5">
        <h2 className="text-base font-bold text-fg">Nét chữ Hán</h2>
        <p>
          Dữ liệu nét:{" "}
          <a href="https://github.com/skishore/makemeahanzi" {...ext}>
            Make Me a Hanzi
          </a>
          , từ phông của Arphic Technology (
          <a href="/hanzi/ARPHICPL.TXT" {...ext}>
            Arphic Public License
          </a>
          ). Thư viện vẽ:{" "}
          <a href="https://github.com/chanind/hanzi-writer" {...ext}>
            Hanzi Writer
          </a>{" "}
          (MIT).
        </p>
      </section>

      <section className="card space-y-2 p-5">
        <h2 className="text-base font-bold text-fg">Âm IPA</h2>
        <p>
          Giọng người từ Wikimedia Commons; riêng /ŋ/ do mô hình Kokoro tạo. Đã chỉnh sửa: cắt đoạn chứa âm, đổi độ dài, chuyển sang mp3, cân bằng âm lượng.
        </p>
        <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {IPA_RECORDINGS.map((r) => {
            const licenseUrl = LICENSE_URL[r.license];
            return (
              <li key={r.id}>
                <span className="font-ipa text-fg">/{IPA_MAP[r.id]?.symbol}/</span> {r.word && <span lang="en">{r.word} </span>}
                <a href={recordingSourceUrl(r)} {...ext}>
                  {r.file}
                </a>
                {r.author && ` · ${r.author}`} ·{" "}
                {licenseUrl ? (
                  <a href={licenseUrl} {...ext}>
                    {r.license}
                  </a>
                ) : (
                  r.license
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
