/* eslint-disable no-restricted-properties */
/** @format */
/* eslint-disable import/prefer-default-export */

import SuperAdminService from '../services/SuperAdminService';

const fun1 = async () => {
    const data = await SuperAdminService.getSupConfig();
    return data.orgLogo;
};

export const BGURL = fun1();

export const BATCH = 'Batch';
// socket events and emits
export const SINGLE_FOOTER_COORDINATES = 'singleFooterCoordinates';
export const MULTI_FOOTER_COORDINATES = 'multiFooterCoordinates';

export const CONFIRM_FOOTER_TEXT = 'CONFIRM_FOOTER_TEXT';

export const SINGLE_PAGE_FOOTER_TEXT = 'singlePageFooterText';
export const MULTI_PAGE_FOOTER_TEXT = 'multiPageFooterText';

export const PROCESSED_DATA_RESPONSE = 'processedDataResponse';
export const AUTO_COORDINATES_RESPONSE = 'autoCoordinatesResponse';

export const ON_BATCH_COMPLETE = 'onBatchComplte';

// process types
export const AUTOMATIC = 'automatic';
export const SEMI_AUTOMATIC = 'semiAutomatic';
export const MANUAL = 'manual';

export const MANAGE_TEMPLATE = 'manageTemplate';

export const TEMP_PROCESS = 'tempProcess';
export const SAVE_PROCESS = 'save Process';
export const YOLO_COORDINATES = 'yoloCoOrdinates';

export const CLASS_LIST = [
    { className: 'Name', value: 'name' },
    { className: 'Address', value: 'address' },
    { className: 'Phone Number', value: 'phone_number' },
    { className: 'Email Id', value: 'email_id' },
    { className: 'Gender', value: 'gender' },
    { className: 'Date Of Birth', value: 'date_of_birth' },
    { className: 'Nationality', value: 'nationality' },
    { className: 'Personal Information', value: 'personal_information' },
    { className: 'Work Experience', value: 'work_experience_1' },
    { className: 'Education', value: 'education_1' },
    { className: 'Language', value: 'language' },
    { className: 'Table 1', value: 'table_1' },
    { className: 'Other Skills', value: 'other_skills_1' },
    { className: 'Table 2', value: 'table_2' },
    { className: 'Driving License', value: 'driving_license' },
    { className: 'Fiscal Code', value: 'fiscal_code' },
];

export const CLASS_LIST2 = [
    { className: 'Name', value: 'name' },
    { className: 'Address', value: 'address' },
    { className: 'Phone Number', value: 'phone_number' },
    { className: 'Email Id', value: 'email_id' },
    { className: 'Gender', value: 'gender' },
    { className: 'Date Of Birth', value: 'date_of_birth' },
    { className: 'Nationality', value: 'nationality' },
    { className: 'Personal Information', value: 'personal_information' },
    { className: 'Work Experience', value: 'work_experience' },
    { className: 'Education', value: 'education' },
    { className: 'Language', value: 'language' },
    { className: 'Table 1', value: 'table_1' },
    { className: 'Other Skills', value: 'other_skills' },
    { className: 'Table 2', value: 'table_2' },
    { className: 'Driving License', value: 'driving_license' },
    { className: 'Fiscal Code', value: 'fiscal_code' },
];

export const ADD_TEMPLATE = 'create';
export const EDIT_TEMPLATE = 'edit';

// * list of constants
// FIRST SCREEN OPTIONS
export const SINGLE = 'single';
export const MULTIPLE = 'multiple';

// SCREEN TYPES
export const SELECT_SCAN_SCREEN = 'selectScanTypeScreen';
export const SELECT_TAMPLATE_SCREEN = 'selectTemplateScreen';
export const UPLOAD_DOCUMENT_SCREEN = 'uploadDocumentScreen';
export const UPLOAD_SINGLE_CV_SCREEN = 'uploadCVScreen';
export const UPLOAD_MULTIPLE_CV_SCREEN = 'uploadMultipleCVScreen';
export const SELECT_PROCESS_TYPE_SCREEN = 'selectProcessTypeScreen';
export const DATA_EXTRATION_SCREEN = 'data_extraction_screen';

export const CURRENT_PROCESS_PERCENTAGE = 'currentProcesPercentage';

export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

export const START = 'START';
export const STOP = 'STOP';

export const BATCH_PROGRESS_COUNT = 'batchProgressCount';

export const CURRENT_BATCH_STATUS = 'CURRENT_BATCH_STATUS';

export const OPERATION_CV_STATUS = 'OPERATION_CV_STATUS';
export const OPERATION_CANDIDATE = 'OPERATION_CANDIDATE';

// V2 CONSTANTS

export const INVOICE_COORDINATES = 'invoiceCoordinates';
export const DOCS_PROCESS_STATUS = 'docsProcessStatus';
export const REPORT_PROCESS_STATUS = 'reportProcessStatus';
export const REPORT_CLEANUP_PROCESS_STATUS = 'reportCleanupProcessStatus';
export const ERROR_STATUS = 'errorStatus';
export const refreshClientData = 'refreshClientData';

// FolderName For ReportUpload
export const COMPLETED_REPORTS = 'Completed Reports';
export const RAW_MEDICAL_RECORDS = 'Raw Medical Records';
export const VENDOR_USER = 'vendor';
export const CLIENT_USER = 'client';
export const ROOT_FOLDER_ID = '62869398dc08eb010068be19';
export const BULK_UPLOAD = 'bulkupload';
export const SINGLE_UPLOAD = 'singleupload';

// FILE TYPES
export const PDF_TYPE = 'application/pdf';
export const DOC_TYPE = 'application/msword';
export const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const XLS_TYPE = 'application/vnd.ms-excel';
export const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// should be set to false while pushing to remote repo
// export const DEBUG = false;
export const DEBUG = true;

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default {};
