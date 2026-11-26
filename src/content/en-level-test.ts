/** Bài kiểm tra trình độ tiếng Anh (trang /level-test). */
import type { LevelCode } from "./types";

/** Một câu trắc nghiệm của bài kiểm tra trình độ. `answer` là chỉ số đáp án đúng. */
export interface LevelQuestion {
  id: string;
  level: Exclude<LevelCode, "C2">;
  prompt: string;
  options: string[];
  answer: number;
}

const q = (id: string, level: LevelQuestion["level"], prompt: string, options: string[], answer: number): LevelQuestion => ({
  id,
  level,
  prompt,
  options,
  answer,
});

/** 4 câu mỗi cấp, xếp từ dễ đến khó. Mỗi cấp kiểm tra cả ngữ pháp lẫn từ vựng. */
export const LEVEL_TEST: LevelQuestion[] = [
  q("a1-1", "A1", "My sister ___ a teacher.", ["am", "is", "are", "be"], 1),
  q("a1-2", "A1", "___ you like coffee?", ["Do", "Does", "Are", "Is"], 0),
  q("a1-3", "A1", "There ___ two cats in the garden.", ["is", "be", "are", "am"], 2),
  q("a1-4", "A1", "I usually get up ___ seven o'clock.", ["in", "on", "at", "to"], 2),

  q("a2-1", "A2", "We ___ to Da Lat last summer.", ["go", "went", "have gone", "were going"], 1),
  q("a2-2", "A2", "This phone is ___ than my old one.", ["more cheap", "cheaper", "cheapest", "the cheaper"], 1),
  q("a2-3", "A2", "I'm tired. I think I ___ go to bed early tonight.", ["will", "am", "did", "have"], 0),
  q("a2-4", "A2", "You ___ wear a seatbelt in the car. It's the law.", ["can", "might", "must", "would"], 2),

  q("b1-1", "B1", "I ___ here since 2020.", ["live", "am living", "have lived", "lived"], 2),
  q("b1-2", "B1", "If I ___ more time, I would learn the guitar.", ["have", "had", "will have", "would have"], 1),
  q("b1-3", "B1", "The bridge ___ in 1998.", ["built", "was built", "has built", "is building"], 1),
  q("b1-4", "B1", "She told me that she ___ tired.", ["is", "was", "be", "will"], 1),

  q("b2-1", "B2", "By the time we arrived, the film ___.", ["already started", "has already started", "had already started", "was already starting"], 2),
  q("b2-2", "B2", "I wish I ___ so much money last weekend.", ["didn't spend", "hadn't spent", "wouldn't spend", "haven't spent"], 1),
  q("b2-3", "B2", "You ___ have told me earlier! Now it's too late.", ["should", "must", "can", "would"], 0),
  q("b2-4", "B2", "The meeting was ___ because the manager was ill.", ["called up", "called off", "called in", "called for"], 1),

  q("c1-1", "C1", "Not only ___ late, but he also forgot the documents.", ["he arrived", "did he arrive", "he did arrive", "arrived he"], 1),
  q("c1-2", "C1", "Had I known about the traffic, I ___ earlier.", ["would leave", "would have left", "had left", "will have left"], 1),
  q("c1-3", "C1", "The new policy has had a ___ effect on small businesses.", ["profound", "deep-seated", "thorough", "steep"], 0),
  q("c1-4", "C1", "It's high time the government ___ action on pollution.", ["takes", "took", "will take", "has taken"], 1),
];
