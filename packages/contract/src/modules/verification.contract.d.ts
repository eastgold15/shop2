import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const VerificationInsertFields: {
    identifier: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    expiresAt: import("@sinclair/typebox").TDate;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const VerificationFields: {
    identifier: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    expiresAt: import("@sinclair/typebox").TDate;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const VerificationContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        identifier: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TString;
        expiresAt: import("@sinclair/typebox").TDate;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        expiresAt: import("@sinclair/typebox").TDate;
        identifier: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        expiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        identifier: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        identifier: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        expiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            identifier: import("@sinclair/typebox").TString;
            value: import("@sinclair/typebox").TString;
            expiresAt: import("@sinclair/typebox").TDate;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type VerificationContract = InferDTO<typeof VerificationContract>;
