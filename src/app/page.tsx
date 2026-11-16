import { HomeDashboard } from "@/components/learn/HomeDashboard";
import { CourseGate } from "@/components/learn/CourseGate";

export default function HomePage() {
  return (
    <CourseGate>
      <HomeDashboard />
    </CourseGate>
  );
}
