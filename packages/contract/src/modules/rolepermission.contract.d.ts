import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const RolePermissionInsertFields: {
    roleId: import("@sinclair/typebox").TString;
    permissionId: import("@sinclair/typebox").TString;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const RolePermissionFields: {
    roleId: import("@sinclair/typebox").TString;
    permissionId: import("@sinclair/typebox").TString;
};
export declare const RolePermissionContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        roleId: import("@sinclair/typebox").TString;
        permissionId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        roleId: import("@sinclair/typebox").TString;
        permissionId: import("@sinclair/typebox").TString;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        roleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        permissionId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    readonly Patch: import("@sinclair/typebox").TObject<{
        roleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        permissionId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        roleId: import("@sinclair/typebox").TString;
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            roleId: import("@sinclair/typebox").TString;
            permissionId: import("@sinclair/typebox").TString;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
    readonly BatchUpdate: import("@sinclair/typebox").TObject<{
        roleId: import("@sinclair/typebox").TString;
        permissionIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    }>;
};
export type RolePermissionContract = InferDTO<typeof RolePermissionContract>;
