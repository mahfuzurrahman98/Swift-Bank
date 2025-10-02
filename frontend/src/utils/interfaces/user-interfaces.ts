import type { UserRole, UserStatus } from "@/utils/enums/user";
import type {
    UserProfileSettingsPayload,
    VendorProfileSettingsPayload,
} from "@/utils/schemas/user-schema";

export type UserRoleType = UserRole[keyof UserRole];

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

export interface UserSettingsFormResponse {
    user: UserProfileSettingsPayload | VendorProfileSettingsPayload;
}
