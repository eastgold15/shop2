import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const DailyInquiryCounterInsertFields: {
    date: import("@sinclair/typebox").TString;
    count: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    lastResetAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const DailyInquiryCounterFields: {
    date: import("@sinclair/typebox").TString;
    count: import("@sinclair/typebox").TInteger;
    lastResetAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const DailyInquiryCounterContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        date: import("@sinclair/typebox").TString;
        count: import("@sinclair/typebox").TInteger;
        lastResetAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        date: import("@sinclair/typebox").TString;
        count: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        lastResetAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        date: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        count: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        lastResetAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        date: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        count: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        lastResetAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            date: import("@sinclair/typebox").TString;
            count: import("@sinclair/typebox").TInteger;
            lastResetAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type DailyInquiryCounterContract = InferDTO<typeof DailyInquiryCounterContract>;
