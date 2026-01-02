import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const UserRoleInsertFields: {
    userId: import("@sinclair/typebox").TString;
    roleId: import("@sinclair/typebox").TString;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const UserRoleFields: {
    userId: import("@sinclair/typebox").TString;
    roleId: import("@sinclair/typebox").TString;
};
export declare const UserRoleContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        userId: import("@sinclair/typebox").TString;
        roleId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        roleId: import("@sinclair/typebox").TString;
        userId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        roleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        userId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        userId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        roleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            userId: import("@sinclair/typebox").TString;
            roleId: import("@sinclair/typebox").TString;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type UserRoleContract = InferDTO<typeof UserRoleContract>;
