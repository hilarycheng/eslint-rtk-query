import { rule as strictInputOutputTypeBuilder } from './strict-input-output-type-builder';
import { rule as getQueryBuilderQuery } from './get-query-builder-query';

export const rules = {
    'strict-input-output-type-builder': strictInputOutputTypeBuilder,
    'get-query-builder-query': getQueryBuilderQuery,
}