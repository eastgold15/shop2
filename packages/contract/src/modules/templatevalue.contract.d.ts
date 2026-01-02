import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const TemplateValueInsertFields: {
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    templateKeyId: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const TemplateValueFields: {
    id: import("@sinclair/typebox").TString;
    templateKeyId: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
};
export declare const TemplateValueContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TString;
        templateKeyId: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TString;
        sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        value: import("@sinclair/typebox").TString;
        templateKeyId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        templateKeyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        templateKeyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TString;
            templateKeyId: import("@sinclair/typebox").TString;
            value: import("@sinclair/typebox").TString;
            sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type TemplateValueContract = InferDTO<typeof TemplateValueContract>;
