/** @format */

// ENVIROMENTS
export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

// IMAGE UPLOAD PROCESS TYPES
export const MANUAL = 'manual';
export const MANAGE_TEMPLATE = 'manageTemplate';
export const SEMI_AUTOMATIC = 'semiAutomatic';
export const AUTOMATIC = 'automatic';

// server root
export const ROOT_PATH = '/usr/src/app';

// MANAGE CLASSS
export const CLASSES_FETCH = 'fetch';
export const CLASSES_INSERT = 'insert';
export const CLASSES_UPDATE = 'update';
export const CLASSES_DELETE = 'delete';

// TEMPLATE TYPE
export const MULTI_PAGE = 'multiPage';
export const SINGLE_PAGE = 'singlePage';

export const FIXED = 'fixed';
export const VARIABLE = 'variable';

// emits
export const SINGLE_FOOTER_COORDINATES = 'singleFooterCoordinates';
export const MULTI_FOOTER_COORDINATES = 'multiFooterCoordinates';

export const SINGLE_PAGE_COORDINATE = 'singlePageCoordinate';
export const MULTI_PAGE_COORDINATE = 'multiPageCoordinate';

export const SINGLE_PAGE_FOOTER_TEXT = 'singlePageFooterText';
export const MULTI_PAGE_FOOTER_TEXT = 'multiPageFooterText';

export const INVOICE_COORDINATES = 'invoiceCoordinates';

export const CONFIRM_FOOTER_TEXT = 'CONFIRM_FOOTER_TEXT';

export const PROCESSED_DATA = 'processedData';

export const SINGLE_SEMI_AUTOMATIC_INVOICE_COORDIANTE = 'singleSemiAutomaticInvoice';
export const MULTI_SEMI_AUTOMATIC_INVOICE_COORDIANTE = 'multiSemiAutomaticInvoice';

export const ON_AUTO_SELECT_TEMPLATE = 'onAutoSelectTemplate';
export const ON_CREATE_TEMPLATE_IDENTIFIER = 'onCreateTemplateIdentifier';

export const ON_YOLO_PROCESS_COMPLETE = 'onYoloProcessComplete';
export const ON_EXTRACT_PROCESS_COMPLETE = 'onExtractProcessComplete';

export const SINGLE_LAST_PAGE_COORDINATES = 'singleLastPageCoordinates';
export const MULTI_LAST_PAGE_COORDINATES = 'multiLastPageCoordinates';

export const FIRST_PAGE_COORDINATES = 'firstPageCoordinate';
export const SECOND_PAGE_COORDINATES = 'secondPageCoordinate';
export const LAST_PAGE_COORDINATES = 'lastPageCoordinates';

export const PRIDICT_NEW_MULTIPAGE_INVOICE_COORDINATES = 'pridictNewMultiPageInvoice';

export const PROCESSED_DATA_RESPONSE = 'processedDataResponse';

export const AUTO_COORDINATES_RESPONSE = 'autoCoordinatesResponse';

export const ON_BATCH_COMPLETE = 'onBatchComplte';
export const CURRENT_PROCESS_PERCENTAGE = 'currentProcesPercentage';
export const CURRENT_BATCH_STATUS = 'CURRENT_BATCH_STATUS';

export const ON_GOING_BATCH_PROCESS_EVENT = 'ON_GOING_BATCH_PROCESS_EVENT';

// audit moduels and types
export const CV_PROCESSING = 'CV_PROCESSING';
export const USER_MANAGEMENT = 'USER_MANAGEMENT';
export const ADMIN_MANAGEMENT = 'ADMIN_MANAGEMENT';
export const SUPERADMIN_MANAGEMENT = 'SUPERADMIN_MANAGEMENT';
export const SUPERADMIN_CONFIG = 'SUPERADMIN_CONFIG';
export const USER_PROFILE = 'USER_PROFILE';
export const USER_EMAIL_CONFIG = 'USER_EMAIL_CONFIG';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const USER_CV_STATUS = 'USER_CV_STATUS';
export const ADMIN_CV_STATUS = 'ADMIN_CV_STATUS';
export const USER_CANDIDATES = 'USER_CANDIDATES';
export const ADMIN_CANDIDATES = 'ADMIN_CANDIDATES';
export const ADMIN_CATEGORY = 'ADMIN_CATEGORY';
export const ADMIN_GROUP = 'ADMIN_GROUP';
export const ORG_MANAGEMENT = 'ORG_MANAGEMENT';
export const TEMPLATE_MANAGEMENT = 'TEMPLATE_MANAGEMENT';
export const DOCS_PROCESS_STATUS = 'docsProcessStatus';
export const REPORT_PROCESS_STATUS = 'reportProcessStatus';
export const REPORT_CLEANUP_PROCESS_STATUS = 'reportCleanupProcessStatus';
export const ERROR_STATUS = 'errorStatus';
export type AUDIT_MODULES =
    | typeof CV_PROCESSING
    | typeof USER_MANAGEMENT
    | typeof ADMIN_MANAGEMENT
    | typeof SUPERADMIN_MANAGEMENT
    | typeof SUPERADMIN_CONFIG
    | typeof USER_PROFILE
    | typeof USER_EMAIL_CONFIG
    | typeof RESET_PASSWORD
    | typeof USER_CV_STATUS
    | typeof ADMIN_CV_STATUS
    | typeof ADMIN_CATEGORY
    | typeof USER_CANDIDATES
    | typeof ADMIN_CANDIDATES
    | typeof ADMIN_GROUP
    | typeof ORG_MANAGEMENT
    | typeof TEMPLATE_MANAGEMENT
    | 'define your modules';

/* --------------------------- Excel File constant -------------------------- */
export const ExcelSheet_ProviderName = 'Provider Name';
export const ExcelSheet_Date = 'Date';
export const ExcelSheet_NameofReport = 'Name of Report';
export const ExcelSheet_PageNo = 'Page No.';

// FolderName For ReportUpload
export const COMPLETED_REPORTS = 'Completed Reports';
export const RAW_MEDICAL_RECORDS = 'Raw Medical Records';
export const VENDOR_USER = 'vendor';
export const CLIENT_USER = 'client';
export const ROOT_FOLDER_ID = '62869398dc08eb010068be19';
export const randColor = () => {
    return (
        '#' +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0')
            .toUpperCase()
    );
};

// FILE TYPES
export const PDF_TYPE = 'application/pdf';
export const DOC_TYPE = 'application/msword';
export const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const XLS_TYPE = 'application/vnd.ms-excel';
export const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// socket io room secret key
export const USER_ROOM_KEY = '6d65b220027ce'; // use this key to connect to a room with user id

// project 2 string constants
export const pdfDirName = 'raw';
export const summaryPdfDir = 'summary';
export const genericErrorMsg = 'Request could not be processed due to system error. Please contact Administrator or Technical Support';
export const refreshClientData = 'refreshClientData';
export const DEBUG = false;
// export const DEBUG = true;
