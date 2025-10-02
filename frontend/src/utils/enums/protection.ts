export enum Protection {
    PRIVATE = "authenticated", // Only for logged-in users
    GUEST_ONLY = "unauthenticated", // Only for logged-out users
    PUBLIC = "public", // Accessible by anyone
}
