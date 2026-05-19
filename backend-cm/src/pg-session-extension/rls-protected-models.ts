// Prisma models whose tables have an RLS policy

export const COMPLAINT_OUTCOME_RLS_MODELS = new Set<string>(["complaint_outcome"]);

export const CASE_FILE_RLS_MODELS = new Set<string>(["case_file", "case_activity"]);

export const INSPECTION_RLS_MODELS = new Set<string>(["inspection"]);

export const INVESTIGATION_RLS_MODELS = new Set<string>(["investigation", "task"]);
