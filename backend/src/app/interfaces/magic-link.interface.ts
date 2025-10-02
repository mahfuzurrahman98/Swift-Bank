export interface DeviceInfo {
    userAgent: string;
    ipAddress: string;
    deviceType: "mobile" | "desktop" | "tablet";
}

export interface MagicLinkToken {
    _id: any;
    userId: string;
    token: string;
    requestDevice: DeviceInfo;
    expiresAt: Date;
    used: boolean;
    usedAt?: Date;
    invalidatedBy?: "NEW_REQUEST" | "MANUAL" | "EXPIRED";
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
