export function generateSlug(companyName: string): string {
    const generatedSlug = companyName
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, "") // Remove special characters
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens

    return generatedSlug;
}
