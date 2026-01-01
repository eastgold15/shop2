import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const ProductSiteCategoryInsertFields: {
    productId: import("@sinclair/typebox").TString;
    siteCategoryId: import("@sinclair/typebox").TString;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const ProductSiteCategoryFields: {
    productId: import("@sinclair/typebox").TString;
    siteCategoryId: import("@sinclair/typebox").TString;
};
export declare const ProductSiteCategoryContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        productId: import("@sinclair/typebox").TString;
        siteCategoryId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        siteCategoryId: import("@sinclair/typebox").TString;
        productId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        siteCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        productId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        productId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        siteCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            productId: import("@sinclair/typebox").TString;
            siteCategoryId: import("@sinclair/typebox").TString;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type ProductSiteCategoryContract = InferDTO<typeof ProductSiteCategoryContract>;
