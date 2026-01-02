import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const AccountInsertFields: {
    accountId: import("@sinclair/typebox").TString;
    providerId: import("@sinclair/typebox").TString;
    userId: import("@sinclair/typebox").TString;
    accessToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    refreshToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    idToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    accessTokenExpiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
    refreshTokenExpiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
    scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const AccountFields: {
    accountId: import("@sinclair/typebox").TString;
    providerId: import("@sinclair/typebox").TString;
    userId: import("@sinclair/typebox").TString;
    accessToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    refreshToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    idToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    accessTokenExpiresAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
    refreshTokenExpiresAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
    scope: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    password: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const AccountContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        accountId: import("@sinclair/typebox").TString;
        providerId: import("@sinclair/typebox").TString;
        userId: import("@sinclair/typebox").TString;
        accessToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        refreshToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        idToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        accessTokenExpiresAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
        refreshTokenExpiresAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
        scope: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        password: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Create: import("@sinclair/typebox").TObject<{
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        userId: import("@sinclair/typebox").TString;
        accountId: import("@sinclair/typebox").TString;
        providerId: import("@sinclair/typebox").TString;
        accessToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        refreshToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        idToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        accessTokenExpiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
        refreshTokenExpiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
        scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        userId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        accountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        providerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        accessToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        refreshToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        idToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        accessTokenExpiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
        refreshTokenExpiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
        scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListQuery: import("@sinclair/typebox").TObject<{
        search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
        page: import("@sinclair/typebox").TNumber;
        limit: import("@sinclair/typebox").TNumber;
        accountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        providerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        userId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        accessToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        refreshToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        idToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        accessTokenExpiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
        refreshTokenExpiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
        scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
        updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly ListResponse: import("@sinclair/typebox").TObject<{
        data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            accountId: import("@sinclair/typebox").TString;
            providerId: import("@sinclair/typebox").TString;
            userId: import("@sinclair/typebox").TString;
            accessToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            refreshToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            idToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            accessTokenExpiresAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
            refreshTokenExpiresAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>;
            scope: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            password: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type AccountContract = InferDTO<typeof AccountContract>;
