import { type InferDTO } from "../helper/utils";
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const InquiryInsertFields: {
    siteId: import("@sinclair/typebox").TString;
    tenantId: import("@sinclair/typebox").TString;
    deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    inquiryNum: import("@sinclair/typebox").TString;
    customerName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    customerCompany: import("@sinclair/typebox").TString;
    customerEmail: import("@sinclair/typebox").TString;
    customerPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    customerWhatsapp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        pending: "pending";
        quoted: "quoted";
        sent: "sent";
        completed: "completed";
        cancelled: "cancelled";
    }>>;
    skuId: import("@sinclair/typebox").TString;
    productName: import("@sinclair/typebox").TString;
    productDescription: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    quantity: import("@sinclair/typebox").TInteger;
    price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    paymentMethod: import("@sinclair/typebox").TString;
    customerRequirements: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
};
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export declare const InquiryFields: {
    siteId: import("@sinclair/typebox").TString;
    tenantId: import("@sinclair/typebox").TString;
    deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    isPublic: import("@sinclair/typebox").TBoolean;
    inquiryNum: import("@sinclair/typebox").TString;
    customerName: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    customerCompany: import("@sinclair/typebox").TString;
    customerEmail: import("@sinclair/typebox").TString;
    customerPhone: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    customerWhatsapp: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    status: import("@sinclair/typebox").TEnum<{
        pending: "pending";
        quoted: "quoted";
        sent: "sent";
        completed: "completed";
        cancelled: "cancelled";
    }>;
    skuId: import("@sinclair/typebox").TString;
    productName: import("@sinclair/typebox").TString;
    productDescription: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    quantity: import("@sinclair/typebox").TInteger;
    price: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    paymentMethod: import("@sinclair/typebox").TString;
    customerRequirements: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    id: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TDate;
    updatedAt: import("@sinclair/typebox").TDate;
};
export declare const InquiryContract: {
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Response: import("@sinclair/typebox").TObject<{
        siteId: import("@sinclair/typebox").TString;
        tenantId: import("@sinclair/typebox").TString;
        deptId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        createdBy: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        isPublic: import("@sinclair/typebox").TBoolean;
        inquiryNum: import("@sinclair/typebox").TString;
        customerName: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        customerCompany: import("@sinclair/typebox").TString;
        customerEmail: import("@sinclair/typebox").TString;
        customerPhone: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        customerWhatsapp: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        status: import("@sinclair/typebox").TEnum<{
            pending: "pending";
            quoted: "quoted";
            sent: "sent";
            completed: "completed";
            cancelled: "cancelled";
        }>;
        skuId: import("@sinclair/typebox").TString;
        productName: import("@sinclair/typebox").TString;
        productDescription: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        quantity: import("@sinclair/typebox").TInteger;
        price: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        paymentMethod: import("@sinclair/typebox").TString;
        customerRequirements: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
        id: import("@sinclair/typebox").TString;
        createdAt: import("@sinclair/typebox").TDate;
        updatedAt: import("@sinclair/typebox").TDate;
    }>;
    readonly Create: import("@sinclair/typebox").TObject<{
        tenantId: import("@sinclair/typebox").TString;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            pending: "pending";
            quoted: "quoted";
            sent: "sent";
            completed: "completed";
            cancelled: "cancelled";
        }>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        siteId: import("@sinclair/typebox").TString;
        skuId: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TString]>;
        customerName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        customerCompany: import("@sinclair/typebox").TString;
        customerEmail: import("@sinclair/typebox").TString;
        customerPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        customerWhatsapp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        productName: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TString]>;
        productDescription: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        quantity: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNumber]>;
        paymentMethod: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TString]>;
        customerRequirements: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        productId: import("@sinclair/typebox").TString;
        productDesc: import("@sinclair/typebox").TString;
        customerRemarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
    readonly Update: import("@sinclair/typebox").TObject<{
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            pending: "pending";
            quoted: "quoted";
            sent: "sent";
            completed: "completed";
            cancelled: "cancelled";
        }>>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        skuId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        inquiryNum: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        customerCompany: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerEmail: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        customerWhatsapp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        productName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        productDescription: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        paymentMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerRequirements: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    }>;
    readonly Patch: import("@sinclair/typebox").TObject<{
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            pending: "pending";
            quoted: "quoted";
            sent: "sent";
            completed: "completed";
            cancelled: "cancelled";
        }>>;
        tenantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        deptId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        createdBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        skuId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        inquiryNum: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        customerCompany: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerEmail: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        customerWhatsapp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        productName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        productDescription: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        paymentMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerRequirements: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
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
        inquiryNum: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        customerCompany: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerEmail: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerPhone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        customerWhatsapp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
            pending: "pending";
            quoted: "quoted";
            sent: "sent";
            completed: "completed";
            cancelled: "cancelled";
        }>>;
        skuId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        productName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        productDescription: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        paymentMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        customerRequirements: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
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
            inquiryNum: import("@sinclair/typebox").TString;
            customerName: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            customerCompany: import("@sinclair/typebox").TString;
            customerEmail: import("@sinclair/typebox").TString;
            customerPhone: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            customerWhatsapp: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            status: import("@sinclair/typebox").TEnum<{
                pending: "pending";
                quoted: "quoted";
                sent: "sent";
                completed: "completed";
                cancelled: "cancelled";
            }>;
            skuId: import("@sinclair/typebox").TString;
            productName: import("@sinclair/typebox").TString;
            productDescription: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            quantity: import("@sinclair/typebox").TInteger;
            price: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            paymentMethod: import("@sinclair/typebox").TString;
            customerRequirements: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
            id: import("@sinclair/typebox").TString;
            createdAt: import("@sinclair/typebox").TDate;
            updatedAt: import("@sinclair/typebox").TDate;
        }>>;
        total: import("@sinclair/typebox").TNumber;
    }>;
};
export type InquiryContract = InferDTO<typeof InquiryContract>;
