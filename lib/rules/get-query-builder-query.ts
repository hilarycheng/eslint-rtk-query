
import { type TSESTree, ESLintUtils } from "@typescript-eslint/utils";
import { createRule } from "../utils";

export const rule = createRule({
    create(context) {
        const service = ESLintUtils.getParserServices(context);

        return {
            CallExpression(node: TSESTree.CallExpression) {
                if (
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'createApi' &&
                    node.arguments.length > 0 &&
                    node.arguments[0].type === 'ObjectExpression'
                ) {
                    const apiConfig = node.arguments[0];

                    const endpointsProperty = apiConfig.properties.find(
                        properties => {
                            return properties.type === 'Property' &&
                                properties.key.type === 'Identifier' &&
                                properties.key.name === 'endpoints'
                        }
                    );

                    if (
                        endpointsProperty &&
                        endpointsProperty.type === 'Property' &&
                        endpointsProperty.value.type === 'ArrowFunctionExpression' &&
                        endpointsProperty.value.body.type === 'ObjectExpression'
                    ) {
                        const endpointDefinitions = endpointsProperty.value.body.properties;

                        for (const property of endpointDefinitions) {
                            if (
                                property.type === 'Property' &&
                                property.value.type === 'CallExpression' &&
                                property.value.callee.type === 'MemberExpression' &&
                                property.value.callee.object.type === 'Identifier' &&
                                property.value.callee.property.type === 'Identifier' &&
                                property.value.callee.property &&
                                ['query', 'mutation'].includes(property.value.callee.property.name)
                            ) {
                                const methodName = property.key.type === 'Identifier' ? property.key.name : '<unknown>';
                                const builderMethod = property.value.callee.property.name;

                                if (!methodName.startsWith('get') && builderMethod === 'query') {
                                    context.report({
                                        node: property.value.callee.property,
                                        messageId: 'incorrectBuilderMutation',
                                    });
                                } else if ((methodName.startsWith('query') || methodName.startsWith('qry') || methodName.startsWith('load')) &&
                                    builderMethod === 'mutation') {
                                    context.report({
                                        node: property.value.callee.property,
                                        messageId: 'incorrectBuilderMutation',
                                    });
                                } else if (methodName.startsWith('get') && builderMethod !== 'query') {
                                    context.report({
                                        node: property.value.callee.property,
                                        messageId: 'incorrectBuilderMutation',
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    meta: {
        docs: {
            description: "Enforce builder.query for get/query api",
            recommended: true,
            requiresTypeChecking: true,
        },
        messages: {
            'incorrectBuilderMutation': "Enforce builder.query for get/query api",
        },
        type: "problem",
        schema: [],
    },
    name: "strict-input-output-type-builder",
    defaultOptions: [],
})