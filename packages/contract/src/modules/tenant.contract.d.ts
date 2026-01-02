import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const TenantInsertFields: {
    name: import("@sinclair/typebox").TString;
    code: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
    address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    website: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    bankInfo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
        beneficiary: string;
        accountNo: string;
    }>, import("@sinclair/typebox").TNull]>>;
    subscriptionPlan: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const TenantFields: {
    name: import("@sinclair/typebox").TString;
    code: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
    address: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    website: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    bankInfo: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
        beneficiary: string;
        accountNo: string;
    }>, import("@sinclair/typebox").TNull]>;
    subscriptionPlan: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const TenantContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        code: import("@sinclair/typebox").TString;
        status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
        address: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        website: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        bankInfo: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
            beneficiary: string;
            accountNo: string;
        }>, import("@sinclair/typebox").TNull]>;
        subscriptionPlan: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        code: import("@sinclair/typebox").TString;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        website: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        bankInfo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
            beneficiary: string;
            accountNo: string;
        }>, import("@sinclair/typebox").TNull]>>;
        subscriptionPlan: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        code: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        website: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        bankInfo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
            beneficiary: string;
            accountNo: string;
        }>, import("@sinclair/typebox").TNull]>>;
        subscriptionPlan: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        code: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        website: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        bankInfo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
            beneficiary: string;
            accountNo: string;
        }>, import("@sinclair/typebox").TNull]>>;
        subscriptionPlan: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            code: import("@sinclair/typebox").TString;
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
            address: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            website: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            bankInfo: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
                beneficiary: string;
                accountNo: string;
            }>, import("@sinclair/typebox").TNull]>;
            subscriptionPlan: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type TenantContract = InferDTO<typeof TenantContract>;
