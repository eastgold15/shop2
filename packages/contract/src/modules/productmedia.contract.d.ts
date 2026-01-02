import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const ProductMediaInsertFields: {
    productId: import("@sinclair/typebox").TString;
    mediaId: import("@sinclair/typebox").TString;
    isMain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const ProductMediaFields: {
    productId: import("@sinclair/typebox").TString;
    mediaId: import("@sinclair/typebox").TString;
    isMain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
    sortOrder: import("@sinclair/typebox").TInteger;
};
export declare const ProductMediaContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        productId: import("@sinclair/typebox").TString;
        mediaId: import("@sinclair/typebox").TString;
        isMain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
        sortOrder: import("@sinclair/typebox").TInteger;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        mediaId: import("@sinclair/typebox").TString;
        productId: import("@sinclair/typebox").TString;
        isMain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        mediaId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        productId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        isMain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        productId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        mediaId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        isMain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            productId: import("@sinclair/typebox").TString;
            mediaId: import("@sinclair/typebox").TString;
            isMain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
            sortOrder: import("@sinclair/typebox").TInteger;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type ProductMediaContract = InferDTO<typeof ProductMediaContract>;
