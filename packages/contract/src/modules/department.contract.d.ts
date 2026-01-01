import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const DepartmentInsertFields: {
    tenantId: import("@sinclair/typebox").TString;
    parentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    name: import("@sinclair/typebox").TString;
    code: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        headquarters: "headquarters";
        factory: "factory";
        office: "office";
    }>>;
    address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    contactPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    logo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    extensions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
        businessLicense?: string;
        mainProducts?: string;
        annualRevenue?: string;
        employeeCount?: number;
    }>, import("@sinclair/typebox").TNull]>>;
    isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const DepartmentFields: {
    tenantId: import("@sinclair/typebox").TString;
    parentId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    name: import("@sinclair/typebox").TString;
    code: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    category: import("@sinclair/typebox").TEnum<{
        headquarters: "headquarters";
        factory: "factory";
        office: "office";
    }>;
    address: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    contactPhone: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    logo: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    extensions: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
        businessLicense?: string;
        mainProducts?: string;
        annualRevenue?: string;
        employeeCount?: number;
    }>, import("@sinclair/typebox").TNull]>;
    isActive: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const DepartmentContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        tenantId: import("@sinclair/typebox").TString;
        parentId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        name: import("@sinclair/typebox").TString;
        code: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        category: import("@sinclair/typebox").TEnum<{
            headquarters: "headquarters";
            factory: "factory";
            office: "office";
        }>;
        address: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        contactPhone: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        logo: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        extensions: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
            businessLicense?: string;
            mainProducts?: string;
            annualRevenue?: string;
            employeeCount?: number;
        }>, import("@sinclair/typebox").TNull]>;
        isActive: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        code: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        tenantId: import("@sinclair/typebox").TString;
        parentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            headquarters: "headquarters";
            factory: "factory";
            office: "office";
        }>>;
        contactPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        logo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        extensions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
            businessLicense?: string;
            mainProducts?: string;
            annualRevenue?: string;
            employeeCount?: number;
        }>, import("@sinclair/typebox").TNull]>>;
        isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        code: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        parentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            headquarters: "headquarters";
            factory: "factory";
            office: "office";
        }>>;
        contactPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        logo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        extensions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
            businessLicense?: string;
            mainProducts?: string;
            annualRevenue?: string;
            employeeCount?: number;
        }>, import("@sinclair/typebox").TNull]>>;
        isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        parentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        code: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            headquarters: "headquarters";
            factory: "factory";
            office: "office";
        }>>;
        address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        contactPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        logo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        extensions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
            businessLicense?: string;
            mainProducts?: string;
            annualRevenue?: string;
            employeeCount?: number;
        }>, import("@sinclair/typebox").TNull]>>;
        isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            tenantId: import("@sinclair/typebox").TString;
            parentId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            name: import("@sinclair/typebox").TString;
            code: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            category: import("@sinclair/typebox").TEnum<{
                headquarters: "headquarters";
                factory: "factory";
                office: "office";
            }>;
            address: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            contactPhone: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            logo: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            extensions: import("@sinclair/typebox").TUnion<[import("drizzle-typebox").GenericSchema<{
                businessLicense?: string;
                mainProducts?: string;
                annualRevenue?: string;
                employeeCount?: number;
            }>, import("@sinclair/typebox").TNull]>;
            isActive: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type DepartmentContract = InferDTO<typeof DepartmentContract>;
