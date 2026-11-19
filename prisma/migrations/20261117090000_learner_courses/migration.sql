-- Dữ liệu học của các khoá ngoài tiếng Anh (tiếng Trung...)
ALTER TABLE "LearnerState" ADD COLUMN "courses" JSONB NOT NULL DEFAULT '{}';
