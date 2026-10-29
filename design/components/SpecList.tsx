/**
 * SpecList — 라벨-값 표. 상세 정보·결과 수치·가게 정보를 줄마다 얇은 선으로 나눠 보여준다.
 *   라벨: 작은 대문자·넓은 자간(eyebrow) 왼쪽 / 값: 오른쪽 정렬, 숫자는 자리 맞춤(tabular)
 * 값이 여러 줄이면 값만 줄을 바꾼다(배열로 넘기면 한 줄에 하나씩). 단위는 값 쪽에 작게.
 * (취향 프로필 R19의 원리 — 원본 화면을 옮기지 않음)
 *
 * v0.2 (CreditList를 여기로 합침)
 * - align="end"(기본, 크레딧·수치형: 값 오른쪽) / "start"(정보형: 라벨 열 고정, 값 왼쪽 — 영업시간·주소처럼 긴 값)
 * - labelStyle="eyebrow"(기본, 13px) / "micro"(영문 대문자 11px — 한글 라벨에는 쓰지 않는다) / "label"(한글 13px, 대문자 변환 없음)
 * - 한 표에서 영문 라벨과 한글 라벨을 섞지 않는다. 한 표는 7줄 이하.
 * 임의 값: 정보형 라벨 열 폭 7.5rem/9rem — 여러 표의 값 시작선을 같은 세로선에 맞추려고 고정한다.
 */
import type { ReactNode } from "react";
import { cx } from "./cx";

export type Spec = { label: string; value: ReactNode | string[]; unit?: string; note?: ReactNode };

const labelClass = {
  eyebrow: "eyebrow",
  micro: "micro-label text-ink-3",
  label: "text-label text-ink-3",
} as const;

export function SpecList({
  items,
  className,
  dense = false,
  align = "end",
  labelStyle = "eyebrow",
}: {
  items: Spec[];
  className?: string;
  dense?: boolean;
  align?: "end" | "start";
  labelStyle?: keyof typeof labelClass;
}) {
  if (items.length > 7) {
    console.warn(`[SpecList] 한 표는 7줄 이하로 (지금 ${items.length}줄). 묶음을 나누세요.`);
  }
  return (
    <dl className={cx("border-t border-line", className)}>
      {items.map((it) => (
        <div
          key={it.label}
          className={cx(
            "border-b border-line",
            dense ? "py-2" : "py-3",
            align === "end"
              ? "flex items-baseline justify-between gap-6"
              : "grid grid-cols-[7.5rem_1fr] items-baseline gap-4 md:grid-cols-[9rem_1fr]",
          )}
        >
          <dt className={cx(labelClass[labelStyle], "shrink-0")}>{it.label}</dt>
          <dd className={cx("min-w-0", align === "end" && "text-right")}>
            {Array.isArray(it.value) ? (
              <ul className="text-body tabular-nums text-ink">
                {it.value.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            ) : (
              <span className="text-body tabular-nums text-ink">{it.value}</span>
            )}
            {it.unit ? <span className="ml-1 text-label text-ink-3">{it.unit}</span> : null}
            {it.note ? <span className="block text-label text-ink-3">{it.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
