import { errors } from "@/lib/data/errors";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NavigationPaths } from "@/utils/enums/navigation-paths";
import type { IError } from "@/utils/interfaces/error-interface";

export const Error = ({ code }: { code: number }) => {
    const error = errors.filter((err: IError) => err.code === code)[0];
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center min-h-screen bg-backgroun">
            <div className="rounded flex flex-col justify-center text-center">
                <h2 className="text-3xl font-semibold mb-4">
                    {error.code} | {error.message}
                </h2>
                <p className="mb-4 text-muted-foreground">
                    {error.description}
                </p>

                <Button
                    onClick={() => navigate(NavigationPaths.DASHBOARD)}
                    className=""
                >
                    <span>Back to Home</span>
                </Button>
            </div>
        </div>
    );
};
