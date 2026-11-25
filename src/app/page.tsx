import { CourseGate } from "@/components/learn/CourseGate";
import { TodayHub } from "@/components/learn/TodayHub";

export default function HomePage() {
  return (
    <CourseGate>
      <TodayHub course="en" />
    </CourseGate>
  );
}
