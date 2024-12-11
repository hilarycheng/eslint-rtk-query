import path from "node:path";
import tseslint from "typescript-eslint";
import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";

import { rule } from "./get-query-builder-query";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            projectService: {
                allowDefaultProject: ["*.ts*"],
                defaultProject: "tsconfig.json",
            },
            tsconfigRootDir: path.join(__dirname, "../.."),
        },
    },
});

ruleTester.run("", rule, {
    valid: [
        `
        createApi({
            endpoints: (builder) => ({
                getPosts: builder.query<Response, Request>({
                }),
            })
        })
        `
    ],
    invalid: [
        {
            code: `
            createApi({
                endpoints: (builder) => ({
                    getPosts: builder.mutation({
                    }),
                    queryPosts: builder.mutation({
                    }),
                    qryPosts: builder.mutation({
                    }),
                    queryPosts: builder.query({
                    }),
                    qryPosts: builder.query({
                    }),
                    loadPosts: builder.query({
                    }),
                })
            })
            `,
            errors: [
                {
                    line: 4,
                    endLine: 4,
                    column: 39,
                    messageId: "incorrectBuilderMutation",
                },
                {
                    line: 6,
                    endLine: 6,
                    column: 41,
                    messageId: "incorrectBuilderMutation",
                },
                {
                    line: 8,
                    endLine: 8,
                    column: 39,
                    messageId: "incorrectBuilderMutation",
                },
                {
                    line: 10,
                    endLine: 10,
                    column: 41,
                    messageId: "incorrectBuilderMutation",
                },
                {
                    line: 12,
                    endLine: 12,
                    column: 39,
                    messageId: "incorrectBuilderMutation",
                },
                {
                    line: 14,
                    endLine: 14,
                    column: 40,
                    messageId: "incorrectBuilderMutation",
                }
            ]
        }
    ],
});