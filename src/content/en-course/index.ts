import { A1_UNIT1 } from "./a1-unit1";
import { A1_UNIT2 } from "./a1-unit2";
import { A1_UNIT3 } from "./a1-unit3";
import { A1_UNIT4 } from "./a1-unit4";
import type { CourseDay, CourseUnit } from "./types";

export * from "./types";

/** Khoá A1 20 ngày của khoá tiếng Anh (trang /a1-course). */
export const EN_COURSE_UNITS: CourseUnit[] = [A1_UNIT1, A1_UNIT2, A1_UNIT3, A1_UNIT4];
export const EN_COURSE_DAYS: CourseDay[] = EN_COURSE_UNITS.flatMap((u) => u.days);

export const getEnCourseDay = (day: number) => EN_COURSE_DAYS.find((d) => d.day === day);
