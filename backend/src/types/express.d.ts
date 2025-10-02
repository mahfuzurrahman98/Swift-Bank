import { RequestUser } from "@/app/interfaces/auth.interface";

declare global {
    namespace Express {
        interface Request {
            user?: RequestUser;
        }
    }
}
