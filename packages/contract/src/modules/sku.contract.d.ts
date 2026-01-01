import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const SkuInsertFields: {
    tenantId: import("@sinclair/typebox").TString;
    deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    skuCode: import("@sinclair/typebox").TString;
    price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    marketPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    costPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    volume: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    stock: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    specJson: import("drizzle-typebox").JsonSchema;
    extraAttributes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").JsonSchema, import("@sinclair/typebox").TNull]>>;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    productId: import("@sinclair/typebox").TString;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const SkuFields: {
    tenantId: import("@sinclair/typebox").TString;
    deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    isPublic: import("@sinclair/typebox").TBoolean;
    skuCode: import("@sinclair/typebox").TString;
    price: import("@sinclair/typebox").TString;
    marketPrice: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    costPrice: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    weight: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    volume: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    stock: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    specJson: import("drizzle-typebox").JsonSchema;
    extraAttributes: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").JsonSchema, import("@sinclair/typebox").TNull]>;
    status: import("@sinclair/typebox").TInteger;
    productId: import("@sinclair/typebox").TString;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const SkuContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        tenantId: import("@sinclair/typebox").TString;
        deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        isPublic: import("@sinclair/typebox").TBoolean;
        skuCode: import("@sinclair/typebox").TString;
        price: import("@sinclair/typebox").TString;
        marketPrice: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        costPrice: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        weight: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        volume: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        stock: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        specJson: import("drizzle-typebox").JsonSchema;
        extraAttributes: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").JsonSchema, import("@sinclair/typebox").TNull]>;
        status: import("@sinclair/typebox").TInteger;
        productId: import("@sinclair/typebox").TString;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        tenantId: import("@sinclair/typebox").TString;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        productId: import("@sinclair/typebox").TString;
        skuCode: import("@sinclair/typebox").TString;
        price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        marketPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        costPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        volume: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        stock: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        specJson: import("drizzle-typebox").JsonSchema;
        extraAttributes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").JsonSchema, import("@sinclair/typebox").TNull]>>;
    }>;
    readonly Update: import("@sinclair/typebox").TObject<{
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        productId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        skuCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        marketPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        costPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        volume: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        stock: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        specJson: import("@sinclair/typebox").TOptional<import("drizzle-typebox").JsonSchema>;
        extraAttributes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").JsonSchema, import("@sinclair/typebox").TNull]>>;
        mediaIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        mainImageId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    readonly Patch: import("@sinclair/typebox").TObject<{
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        productId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        skuCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        marketPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        costPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        volume: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        stock: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        specJson: import("@sinclair/typebox").TOptional<import("drizzle-typebox").JsonSchema>;
        extraAttributes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").JsonSchema, import("@sinclair/typebox").TNull]>>;
        mediaIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        mainImageId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    readonly BatchCreate: import("@sinclair/typebox").TObject<{
        productId: import("@sinclair/typebox").TString;
        skus: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            skuCode: import("@sinclair/typebox").TString;
            price: import("@sinclair/typebox").TNumber;
            stock: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            specJson: import("@sinclair/typebox").TAny;
            mediaIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        skuCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        marketPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        costPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        volume: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        stock: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        specJson: import("@sinclair/typebox").TOptional<import("drizzle-typebox").JsonSchema>;
        extraAttributes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").JsonSchema, import("@sinclair/typebox").TNull]>>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        productId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            tenantId: import("@sinclair/typebox").TString;
            deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            isPublic: import("@sinclair/typebox").TBoolean;
            skuCode: import("@sinclair/typebox").TString;
            price: import("@sinclair/typebox").TString;
            marketPrice: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            costPrice: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            weight: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            volume: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            stock: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            specJson: import("drizzle-typebox").JsonSchema;
            extraAttributes: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").JsonSchema, import("@sinclair/typebox").TNull]>;
            status: import("@sinclair/typebox").TInteger;
            productId: import("@sinclair/typebox").TString;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type SkuContract = InferDTO<typeof SkuContract>;
