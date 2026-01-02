import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const AdInsertFields: {
    siteId: import("@sinclair/typebox").TString;
    tenantId: import("@sinclair/typebox").TString;
    deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    title: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    type: import("@sinclair/typebox").TEnum<{
        banner: "banner";
        carousel: "carousel";
        list: "list";
    }>;
    mediaId: import("@sinclair/typebox").TString;
    link: import("@sinclair/typebox").TString;
    position: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
        "home-top": "home-top";
        "home-middle": "home-middle";
        sidebar: "sidebar";
    }>, import("@sinclair/typebox").TNull]>>;
    sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
    isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
    startDate: import("@sinclair/typebox").TDate;
    endDate: import("@sinclair/typebox").TDate;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const AdFields: {
    siteId: import("@sinclair/typebox").TString;
    tenantId: import("@sinclair/typebox").TString;
    deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    isPublic: import("@sinclair/typebox").TBoolean;
    title: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    type: import("@sinclair/typebox").TEnum<{
        banner: "banner";
        carousel: "carousel";
        list: "list";
    }>;
    mediaId: import("@sinclair/typebox").TString;
    link: import("@sinclair/typebox").TString;
    position: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
        "home-top": "home-top";
        "home-middle": "home-middle";
        sidebar: "sidebar";
    }>, import("@sinclair/typebox").TNull]>;
    sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
    isActive: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
    startDate: import("@sinclair/typebox").TDate;
    endDate: import("@sinclair/typebox").TDate;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const AdContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        siteId: import("@sinclair/typebox").TString;
        tenantId: import("@sinclair/typebox").TString;
        deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        isPublic: import("@sinclair/typebox").TBoolean;
        title: import("@sinclair/typebox").TString;
        description: import("@sinclair/typebox").TString;
        type: import("@sinclair/typebox").TEnum<{
            banner: "banner";
            carousel: "carousel";
            list: "list";
        }>;
        mediaId: import("@sinclair/typebox").TString;
        link: import("@sinclair/typebox").TString;
        position: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            "home-top": "home-top";
            "home-middle": "home-middle";
            sidebar: "sidebar";
        }>, import("@sinclair/typebox").TNull]>;
        sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
        isActive: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
        startDate: import("@sinclair/typebox").TDate;
        endDate: import("@sinclair/typebox").TDate;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    readonly Create: import("@sinclair/typebox").TObject<{
        startDate: import("@sinclair/typebox").TString;
        endDate: import("@sinclair/typebox").TString;
        type: import("@sinclair/typebox").TEnum<{
            banner: "banner";
            carousel: "carousel";
            list: "list";
        }>;
        title: import("@sinclair/typebox").TString;
        description: import("@sinclair/typebox").TString;
        link: import("@sinclair/typebox").TString;
        siteId: import("@sinclair/typebox").TString;
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        tenantId: import("@sinclair/typebox").TString;
        isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        position: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            "home-top": "home-top";
            "home-middle": "home-middle";
            sidebar: "sidebar";
        }>, import("@sinclair/typebox").TNull]>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        mediaId: import("@sinclair/typebox").TString;
    }>;
    readonly Update: import("@sinclair/typebox").TObject<{
        startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        endDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            banner: "banner";
            carousel: "carousel";
            list: "list";
        }>>;
        title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        link: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        position: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            "home-top": "home-top";
            "home-middle": "home-middle";
            sidebar: "sidebar";
        }>, import("@sinclair/typebox").TNull]>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        mediaId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        siteId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            banner: "banner";
            carousel: "carousel";
            list: "list";
        }>>;
        mediaId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        link: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        position: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            "home-top": "home-top";
            "home-middle": "home-middle";
            sidebar: "sidebar";
        }>, import("@sinclair/typebox").TNull]>>;
        isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
        startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        endDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            siteId: import("@sinclair/typebox").TString;
            tenantId: import("@sinclair/typebox").TString;
            deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            isPublic: import("@sinclair/typebox").TBoolean;
            title: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TEnum<{
                banner: "banner";
                carousel: "carousel";
                list: "list";
            }>;
            mediaId: import("@sinclair/typebox").TString;
            link: import("@sinclair/typebox").TString;
            position: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
                "home-top": "home-top";
                "home-middle": "home-middle";
                sidebar: "sidebar";
            }>, import("@sinclair/typebox").TNull]>;
            sortOrder: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>;
            isActive: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>;
            startDate: import("@sinclair/typebox").TDate;
            endDate: import("@sinclair/typebox").TDate;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type AdContract = InferDTO<typeof AdContract>;
