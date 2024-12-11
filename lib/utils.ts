import { ESLintUtils } from "@typescript-eslint/utils";

export interface TypedLintingRuleDocs {
    description: string;
    recommended?: boolean;
    requiresTypeChecking?: boolean;
}

export const createRule = ESLintUtils.RuleCreator<TypedLintingRuleDocs>(
    (name) =>
        `https://github.com/eslint-rtk-query/tree/main/eslint-rtk-query/docs/${name}.md`
);