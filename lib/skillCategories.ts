export const SKILL_CATEGORIES = [
    "Programming Languages",
    "Frontend Development",
    "Backend Development",
    "Database & Cloud",
    "Mobile Development",
    "DevOps",

    "Tools",
    "Full Stack Development",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
