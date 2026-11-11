/**
 * Danh mục 81 chủ điểm ngữ pháp A1–C1 (PLAN.md mục 2).
 * Thứ tự trong mỗi cấp = thứ tự học được gợi ý.
 * Chủ điểm nào có nội dung đầy đủ được khai báo trong ./topics.
 */
import type { Category, LevelCode, TopicMeta } from "./types";

type Row = [slug: string, category: Category, title: string, titleEn: string];

const RAW: Record<Exclude<LevelCode, "C2">, Row[]> = {
  A1: [
    ["to-be", "TENSE", "Động từ to be (am / is / are)", "The verb to be"],
    ["pronouns", "WORD", "Đại từ nhân xưng chủ ngữ & tân ngữ", "Subject & object pronouns"],
    ["possessives", "WORD", "Tính từ sở hữu & sở hữu cách 's", "Possessive adjectives & 's"],
    ["articles-basic", "WORD", "Mạo từ a / an / the", "Articles a / an / the"],
    ["plural-nouns", "WORD", "Danh từ số nhiều", "Plural nouns"],
    ["demonstratives", "WORD", "this / that / these / those", "Demonstratives"],
    ["there-is-are", "STRUCT", "There is / There are", "There is / There are"],
    ["present-simple", "TENSE", "Thì hiện tại đơn", "Present simple"],
    ["frequency-adverbs", "WORD", "Trạng từ chỉ tần suất", "Adverbs of frequency"],
    ["present-continuous", "TENSE", "Thì hiện tại tiếp diễn", "Present continuous"],
    ["simple-vs-continuous", "TENSE", "Hiện tại đơn vs hiện tại tiếp diễn", "Present simple vs continuous"],
    ["can-cant", "MODAL", "can / can't", "can / can't"],
    ["imperatives", "STRUCT", "Câu mệnh lệnh", "Imperatives"],
    ["prepositions-time-place", "WORD", "Giới từ in / on / at", "Prepositions of time & place"],
    ["question-words", "STRUCT", "Từ để hỏi (Wh-questions)", "Question words"],
    ["some-any", "WORD", "Danh từ đếm được/không đếm được, some / any", "Countable & uncountable, some / any"],
  ],
  A2: [
    ["past-be", "TENSE", "Quá khứ của to be (was / were)", "Past of to be"],
    ["past-simple", "TENSE", "Thì quá khứ đơn", "Past simple"],
    ["past-continuous", "TENSE", "Thì quá khứ tiếp diễn", "Past continuous"],
    ["past-simple-vs-continuous", "TENSE", "Quá khứ đơn vs quá khứ tiếp diễn", "Past simple vs continuous"],
    ["will-going-to", "TENSE", "Tương lai: will vs be going to", "will vs be going to"],
    ["present-continuous-future", "TENSE", "Hiện tại tiếp diễn chỉ tương lai", "Present continuous for future"],
    ["present-perfect", "TENSE", "Thì hiện tại hoàn thành", "Present perfect"],
    ["comparatives-superlatives", "STRUCT", "So sánh hơn & so sánh nhất", "Comparatives & superlatives"],
    ["as-as", "STRUCT", "So sánh bằng as ... as", "as ... as"],
    ["adverbs-manner", "WORD", "Trạng từ chỉ cách thức", "Adverbs of manner"],
    ["quantifiers", "WORD", "much / many / a lot of / a few / a little", "Quantifiers"],
    ["must-have-to-should", "MODAL", "must / have to / should", "must / have to / should"],
    ["could-would-like", "MODAL", "could & would like", "could & would like"],
    ["verb-to-ing-basic", "STRUCT", "Động từ + to V / V-ing (cơ bản)", "Verb + to-infinitive / -ing"],
    ["conjunctions-basic", "CLAUSE", "Liên từ and / but / or / because / so", "Basic conjunctions"],
    ["conditional-type-0", "COND", "Câu điều kiện loại 0", "Zero conditional"],
    ["conditional-type-1", "COND", "Câu điều kiện loại 1", "First conditional"],
    ["possessive-reflexive", "WORD", "Đại từ sở hữu & phản thân", "Possessive & reflexive pronouns"],
  ],
  B1: [
    ["present-perfect-vs-past", "TENSE", "Hiện tại hoàn thành vs quá khứ đơn", "Present perfect vs past simple"],
    ["present-perfect-continuous", "TENSE", "Thì hiện tại hoàn thành tiếp diễn", "Present perfect continuous"],
    ["past-perfect", "TENSE", "Thì quá khứ hoàn thành", "Past perfect"],
    ["used-to-would", "STRUCT", "used to / would", "used to / would"],
    ["conditional-type-2", "COND", "Câu điều kiện loại 2", "Second conditional"],
    ["unless-in-case", "COND", "unless / as long as / in case", "unless / as long as / in case"],
    ["passive-present-past", "PASSIVE", "Bị động: hiện tại đơn & quá khứ đơn", "Passive: present & past simple"],
    ["passive-other-tenses", "PASSIVE", "Bị động ở các thì khác", "Passive: other tenses"],
    ["defining-relative", "RELATIVE", "Mệnh đề quan hệ xác định", "Defining relative clauses"],
    ["reported-statements", "REPORTED", "Câu tường thuật: câu kể", "Reported statements"],
    ["modals-deduction-present", "MODAL", "Suy đoán hiện tại: must / might / can't", "Modals of deduction (present)"],
    ["gerund-infinitive", "STRUCT", "Gerund vs To-infinitive", "Gerunds vs infinitives"],
    ["too-enough", "STRUCT", "too / enough", "too / enough"],
    ["so-such", "STRUCT", "so / such ... that", "so / such ... that"],
    ["question-tags", "STRUCT", "Câu hỏi đuôi", "Question tags"],
    ["indirect-questions", "STRUCT", "Câu hỏi gián tiếp", "Indirect questions"],
    ["wish-present", "COND", "wish + quá khứ đơn", "wish + past simple"],
    ["phrasal-verbs", "WORD", "Cụm động từ thông dụng", "Common phrasal verbs"],
  ],
  B2: [
    ["future-continuous-perfect", "TENSE", "Tương lai tiếp diễn & tương lai hoàn thành", "Future continuous & perfect"],
    ["past-perfect-continuous", "TENSE", "Thì quá khứ hoàn thành tiếp diễn", "Past perfect continuous"],
    ["twelve-tenses", "TENSE", "Tổng ôn 12 thì", "Review of the 12 tenses"],
    ["conditional-type-3", "COND", "Câu điều kiện loại 3", "Third conditional"],
    ["mixed-conditionals", "COND", "Câu điều kiện hỗn hợp", "Mixed conditionals"],
    ["wish-past", "COND", "wish / if only + quá khứ hoàn thành", "wish / if only + past perfect"],
    ["passive-modals-reporting", "PASSIVE", "Bị động với modal & It is said that...", "Passive with modals & reporting verbs"],
    ["causative", "PASSIVE", "Thể truyền khiến have / get sth done", "Causative have / get"],
    ["reported-questions-commands", "REPORTED", "Tường thuật câu hỏi, mệnh lệnh", "Reported questions & commands"],
    ["non-defining-relative", "RELATIVE", "Mệnh đề quan hệ không xác định", "Non-defining relative clauses"],
    ["reduced-relative", "RELATIVE", "Rút gọn mệnh đề quan hệ", "Reduced relative clauses"],
    ["modals-deduction-past", "MODAL", "Suy đoán quá khứ: must have / might have", "Modals of deduction (past)"],
    ["should-have", "MODAL", "should have / could have / needn't have", "Past modals of regret"],
    ["used-to-be-used-to", "STRUCT", "used to / be used to / get used to", "used to vs be used to"],
    ["would-rather", "STRUCT", "I'd rather / It's time / had better", "would rather / it's time / had better"],
    ["contrast-linkers", "CLAUSE", "although / despite / whereas / however", "Contrast linkers"],
    ["participle-clauses", "CLAUSE", "Mệnh đề phân từ", "Participle clauses"],
  ],
  C1: [
    ["inversion-negative", "STRUCT", "Đảo ngữ với trạng từ phủ định", "Negative inversion"],
    ["inversion-conditional", "COND", "Đảo ngữ câu điều kiện", "Conditional inversion"],
    ["advanced-conditionals", "COND", "Điều kiện nâng cao: but for, provided that", "Advanced conditionals"],
    ["cleft-sentences", "STRUCT", "Câu chẻ", "Cleft sentences"],
    ["subjunctive", "STRUCT", "Thể giả định", "The subjunctive"],
    ["emphasis", "STRUCT", "Cấu trúc nhấn mạnh", "Emphatic structures"],
    ["nominalisation", "STRUCT", "Danh từ hóa", "Nominalisation"],
    ["ellipsis-substitution", "STRUCT", "Tỉnh lược & thay thế", "Ellipsis & substitution"],
    ["future-in-past", "TENSE", "Tương lai trong quá khứ", "Future in the past"],
    ["advanced-articles", "WORD", "Mạo từ nâng cao", "Advanced articles"],
    ["academic-linkers", "CLAUSE", "Từ nối học thuật", "Academic linkers"],
    ["advanced-passive", "PASSIVE", "Bị động nâng cao", "Advanced passive"],
  ],
};

export const CATALOG: TopicMeta[] = (Object.keys(RAW) as Array<keyof typeof RAW>).flatMap((level) =>
  RAW[level].map(([slug, category, title, titleEn]) => ({ slug, level, category, title, titleEn })),
);

export function topicsByLevel(level: LevelCode): TopicMeta[] {
  return CATALOG.filter((t) => t.level === level);
}

export function getTopicMeta(slug: string): TopicMeta | undefined {
  return CATALOG.find((t) => t.slug === slug);
}
