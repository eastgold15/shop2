import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const SkuMediaInsertFields: {
    skuId: import("@sinclair/typebox").TString;
    mediaId: import("@sinclair/typebox").TString;
    isMain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
    tenantId: import("@sinclair/typebox").TString;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const SkuMediaFields: {
    skuId: import("@sinclair/typebox").TString;
    mediaId: import("@sinclair/typebox").TString;
    isMain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
    sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
    tenantId: import("@sinclair/typebox").TString;
};
export declare const SkuMediaContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        skuId: import("@sinclair/typebox").TString;
        mediaId: import("@sinclair/typebox").TString;
        isMain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
        sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
        tenantId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        tenantId: import("@sinclair/typebox").TString;
        mediaId: import("@sinclair/typebox").TString;
        isMain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        skuId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        mediaId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        isMain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        skuId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        skuId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        mediaId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        isMain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            skuId: import("@sinclair/typebox").TString;
            mediaId: import("@sinclair/typebox").TString;
            isMain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
            sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
            tenantId: import("@sinclair/typebox").TString;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type SkuMediaContract = InferDTO<typeof SkuMediaContract>;
