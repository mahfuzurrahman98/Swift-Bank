import { User } from "@/app/interfaces/user.interface";
import { RequestUser } from "@/app/interfaces/auth.interface";

export function toRequestUser(user: User): RequestUser {
    return {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
    };
}
