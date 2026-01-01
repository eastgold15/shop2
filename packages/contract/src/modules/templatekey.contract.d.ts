import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const TemplateKeyInsertFields: {
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    templateId: import("@sinclair/typebox").TString;
    key: import("@sinclair/typebox").TString;
    inputType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
        number: "number";
        select: "select";
        text: "text";
        multiselect: "multiselect";
    }>, import("@sinclair/typebox").TNull]>>;
    isRequired: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    isSkuSpec: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const TemplateKeyFields: {
    id: import("@sinclair/typebox").TString;
    templateId: import("@sinclair/typebox").TString;
    key: import("@sinclair/typebox").TString;
    inputType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
        number: "number";
        select: "select";
        text: "text";
        multiselect: "multiselect";
    }>, import("@sinclair/typebox").TNull]>;
    isRequired: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
    isSkuSpec: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
    sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
};
export declare const TemplateKeyContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TString;
        templateId: import("@sinclair/typebox").TString;
        key: import("@sinclair/typebox").TString;
        inputType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            number: "number";
            select: "select";
            text: "text";
            multiselect: "multiselect";
        }>, import("@sinclair/typebox").TNull]>;
        isRequired: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
        isSkuSpec: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
        sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        templateId: import("@sinclair/typebox").TString;
        key: import("@sinclair/typebox").TString;
        inputType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            number: "number";
            select: "select";
            text: "text";
            multiselect: "multiselect";
        }>, import("@sinclair/typebox").TNull]>>;
        isRequired: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        isSkuSpec: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        templateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        key: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        inputType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            number: "number";
            select: "select";
            text: "text";
            multiselect: "multiselect";
        }>, import("@sinclair/typebox").TNull]>>;
        isRequired: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        isSkuSpec: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        templateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        key: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        inputType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            number: "number";
            select: "select";
            text: "text";
            multiselect: "multiselect";
        }>, import("@sinclair/typebox").TNull]>>;
        isRequired: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        isSkuSpec: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TString;
            templateId: import("@sinclair/typebox").TString;
            key: import("@sinclair/typebox").TString;
            inputType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
                number: "number";
                select: "select";
                text: "text";
                multiselect: "multiselect";
            }>, import("@sinclair/typebox").TNull]>;
            isRequired: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
            isSkuSpec: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
            sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type TemplateKeyContract = InferDTO<typeof TemplateKeyContract>;
