export const ACCEPTED_FILE_MIME_TYPES = [
    // ✅ Code & Markup Files
    "application/javascript", // .js
    "application/json", // .json
    "text/html", // .html
    "text/css", // .css
    "text/markdown", // .md
    "application/xml", // .xml
    "text/plain", // .txt, .env, .py, etc.
    "text/typescript", // .ts
    "text/jsx", // .jsx
    "text/tsx", // .tsx
    "application/x-sh", // .sh
    "text/x-shellscript", // .bash, .sh
    "text/x-c", // .c, .h
    "text/x-c++", // .cpp, .hpp
    "text/x-java-source", // .java
    "text/x-python", // .py
    "text/x-php", // .php
    "text/x-sql", // .sql
    "text/x-ruby", // .rb
    "text/x-go", // .go
    "text/x-yaml", // .yml, .yaml
    "text/x-perl", // .pl
    "text/x-lua", // .lua
    "text/x-tcl", // .tcl
    "text/coffeescript", // .coffee
    "text/x-vbscript", // .vbs
    "text/x-cmake", // CMake
    "text/x-dockerfile", // Dockerfile
    "text/x-properties", // .properties

    // ✅ Data & Config
    "text/csv", // .csv
    "application/zip", // zipped projects
    "application/octet-stream", // fallback for unknown binary (e.g., .env)

    // ✅ Office Files
    "application/pdf", // .pdf
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];

// Add common text-based MIME types that might be reported differently
export const TEXT_BASED_MIME_TYPES = [
    "text/plain",
    "text/x-script.python",
    "application/octet-stream", // Common fallback MIME type
];

export const ACCEPTED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
];

export const ACCEPTED_FILE_EXTENSIONS = [
    // ✅ Code Files
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "html",
    "css",
    "xml",
    "txt",
    "env",
    "md",
    "c",
    "h",
    "cpp",
    "cc",
    "hpp",
    "java",
    "py",
    "php",
    "sh",
    "bash",
    "sql",
    "rb",
    "go",
    "yml",
    "yaml",
    "pl",
    "lua",
    "tcl",
    "coffee",
    "vbs",
    "cmake",
    "dockerfile",
    "properties",

    // ✅ Data & Config
    "csv",
    "zip",

    // ✅ Office & Document Files
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
];
