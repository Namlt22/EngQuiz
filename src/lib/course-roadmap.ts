/**
 * Lịch học (các ngày + nhiệm vụ) của một khoá học từ hồ sơ lộ trình.
 * Mọi nơi tính tiến độ lộ trình (tự tích bài, đổi hồ sơ, gộp dữ liệu hai máy) phải dùng hàm này,
 * để khoá tiếng Trung không bị dựng theo lịch tiếng Anh.
 */
import type { CourseCode } from "./course";
import { buildRoadmap, type RoadmapProfile } from "./roadmap";
import { buildDays, type RoadmapDay } from "./roadmap-days";
import { buildZhRoadmap } from "./zh-roadmap";

export function daysFor(course: CourseCode, profile: RoadmapProfile): RoadmapDay[] {
  return course === "zh" ? buildZhRoadmap(profile).days : buildDays(buildRoadmap(profile));
}
