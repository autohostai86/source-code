/** @format */

interface OutlineOptions {
    expanded: boolean;
}

interface Outline {
    addItem(title: string, options?: OutlineOptions): Outline;
}

interface PDFDocumentEx extends PDFKit.PDFDocument {
    /**
     * Outlines are the hierarchical bookmarks that display in some PDF readers.
     */
    outline: Outline;
}
