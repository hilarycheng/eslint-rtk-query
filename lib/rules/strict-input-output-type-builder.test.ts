import path from "node:path";
import tseslint from "typescript-eslint";
import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";

import { rule } from "./strict-input-output-type-builder";

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

ruleTester.run("strict-input-output-type-builder", rule, {
    valid: [
        `
        createApi({
            endpoints: (builder) => ({
                getPosts: builder.query<Response, Request>({
                })
            })
        })
        `
    ],
    invalid: [
        {
            code: `
            createApi({
                endpoints: (builder) => ({
                    getPosts: builder.query({
                    })
                })
            })
            `,
            errors: [
                {
                    line: 4,
                    endLine: 5,
                    column: 21,
                    messageId: "missingGenerics",
                }
            ]
        }
    ],
});