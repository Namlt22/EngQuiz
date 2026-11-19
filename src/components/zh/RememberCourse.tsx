"use client";

import { useEffect } from "react";
import { setPreferredCourse } from "@/lib/course-client";

/** Mở bất kỳ trang /zh nào → lần sau vào trang chủ sẽ mở thẳng khoá tiếng Trung. */
export function RememberCourse() {
  useEffect(() => setPreferredCourse("zh"), []);
  return null;
}
