import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const MediaInsertFields: {
    tenantId: import("@sinclair/typebox").TString;
    deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    storageKey: import("@sinclair/typebox").TString;
    category: import("@sinclair/typebox").TString;
    url: import("@sinclair/typebox").TString;
    originalName: import("@sinclair/typebox").TString;
    mimeType: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    thumbnailUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    mediaType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        image: "image";
        video: "video";
        document: "document";
        audio: "audio";
        other: "other";
    }>>;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const MediaFields: {
    tenantId: import("@sinclair/typebox").TString;
    deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    isPublic: import("@sinclair/typebox").TBoolean;
    storageKey: import("@sinclair/typebox").TString;
    category: import("@sinclair/typebox").TString;
    url: import("@sinclair/typebox").TString;
    originalName: import("@sinclair/typebox").TString;
    mimeType: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TBoolean;
    thumbnailUrl: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    mediaType: import("@sinclair/typebox").TEnum<{
        image: "image";
        video: "video";
        document: "document";
        audio: "audio";
        other: "other";
    }>;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const MediaContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        tenantId: import("@sinclair/typebox").TString;
        deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        isPublic: import("@sinclair/typebox").TBoolean;
        storageKey: import("@sinclair/typebox").TString;
        category: import("@sinclair/typebox").TString;
        url: import("@sinclair/typebox").TString;
        originalName: import("@sinclair/typebox").TString;
        mimeType: import("@sinclair/typebox").TString;
        status: import("@sinclair/typebox").TBoolean;
        thumbnailUrl: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        mediaType: import("@sinclair/typebox").TEnum<{
            image: "image";
            video: "video";
            document: "document";
            audio: "audio";
            other: "other";
        }>;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    readonly Entity: import("@sinclair/typebox").TObject<{
        tenantId: import("@sinclair/typebox").TString;
        deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        isPublic: import("@sinclair/typebox").TBoolean;
        storageKey: import("@sinclair/typebox").TString;
        category: import("@sinclair/typebox").TString;
        url: import("@sinclair/typebox").TString;
        originalName: import("@sinclair/typebox").TString;
        mimeType: import("@sinclair/typebox").TString;
        status: import("@sinclair/typebox").TBoolean;
        thumbnailUrl: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        mediaType: import("@sinclair/typebox").TEnum<{
            image: "image";
            video: "video";
            document: "document";
            audio: "audio";
            other: "other";
        }>;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        tenantId: import("@sinclair/typebox").TString;
        category: import("@sinclair/typebox").TString;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        storageKey: import("@sinclair/typebox").TString;
        url: import("@sinclair/typebox").TString;
        originalName: import("@sinclair/typebox").TString;
        mimeType: import("@sinclair/typebox").TString;
        thumbnailUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        mediaType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            image: "image";
            video: "video";
            document: "document";
            audio: "audio";
            other: "other";
        }>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        storageKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        originalName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        thumbnailUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        mediaType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            image: "image";
            video: "video";
            document: "document";
            audio: "audio";
            other: "other";
        }>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>;
    readonly Patch: import("@sinclair/typebox").TObject<{
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        storageKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        originalName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        thumbnailUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        mediaType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            image: "image";
            video: "video";
            document: "document";
            audio: "audio";
            other: "other";
        }>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>;
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        ids: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        storageKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        originalName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        thumbnailUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        mediaType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            image: "image";
            video: "video";
            document: "document";
            audio: "audio";
            other: "other";
        }>>;
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
            storageKey: import("@sinclair/typebox").TString;
            category: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
            originalName: import("@sinclair/typebox").TString;
            mimeType: import("@sinclair/typebox").TString;
            status: import("@sinclair/typebox").TBoolean;
            thumbnailUrl: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            mediaType: import("@sinclair/typebox").TEnum<{
                image: "image";
                video: "video";
                document: "document";
                audio: "audio";
                other: "other";
            }>;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type MediaContract = InferDTO<typeof MediaContract>;
