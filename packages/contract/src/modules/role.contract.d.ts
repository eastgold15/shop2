import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const RoleInsertFields: {
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    name: import("@sinclair/typebox").TString;
    tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    dataScope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        all: "all";
        dept_and_child: "dept_and_child";
        dept_only: "dept_only";
        self: "self";
    }>>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        custom: "custom";
        system: "system";
    }>>;
    priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const RoleFields: {
    id: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    tenantId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    dataScope: import("@sinclair/typebox").TEnum<{
        all: "all";
        dept_and_child: "dept_and_child";
        dept_only: "dept_only";
        self: "self";
    }>;
    description: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    type: import("@sinclair/typebox").TEnum<{
        custom: "custom";
        system: "system";
    }>;
    priority: import("@sinclair/typebox").TInteger;
};
export declare const RoleContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TString;
        name: import("@sinclair/typebox").TString;
        tenantId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        dataScope: import("@sinclair/typebox").TEnum<{
            all: "all";
            dept_and_child: "dept_and_child";
            dept_only: "dept_only";
            self: "self";
        }>;
        description: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        type: import("@sinclair/typebox").TEnum<{
            custom: "custom";
            system: "system";
        }>;
        priority: import("@sinclair/typebox").TInteger;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            custom: "custom";
            system: "system";
        }>>;
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        name: import("@sinclair/typebox").TString;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        dataScope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            all: "all";
            dept_and_child: "dept_and_child";
            dept_only: "dept_only";
            self: "self";
        }>>;
        priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            custom: "custom";
            system: "system";
        }>>;
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        dataScope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            all: "all";
            dept_and_child: "dept_and_child";
            dept_only: "dept_only";
            self: "self";
        }>>;
        priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>;
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TString;
            tenantId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            dataScope: import("@sinclair/typebox").TEnum<{
                all: "all";
                dept_and_child: "dept_and_child";
                dept_only: "dept_only";
                self: "self";
            }>;
            description: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            type: import("@sinclair/typebox").TEnum<{
                custom: "custom";
                system: "system";
            }>;
            priority: import("@sinclair/typebox").TInteger;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type RoleContract = InferDTO<typeof RoleContract>;
