import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthService } from "@/services/auth-services";
import { useAuthStore } from "@/stores/auth-store";
import { NavigationPaths } from "@/utils/enums/navigation-paths";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/custom/alert-message";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";

export default function MagicLinkVerifyPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { setUser, setAccessToken } = useAuthStore();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid magic link - no token provided");
            setIsLoading(false);
            return;
        }

        verifyMagicLink();
    }, [token]);

    const verifyMagicLink = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await AuthService.verifyMagicLink(token!);

            if (response.data) {
                // Set auth state
                setAccessToken(response.data.accessToken);
                setUser(response.data.user);
                setSuccess(true);

                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    navigate(NavigationPaths.DASHBOARD, { replace: true });
                }, 2000);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err: any) {
            setError(err.message || "Failed to verify magic link");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = () => {
        if (isLoading) {
            return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
        }
        if (success) {
            return <CheckCircle className="h-12 w-12 text-green-600" />;
        }
        return <XCircle className="h-12 w-12 text-red-600" />;
    };

    const getStatusColor = () => {
        if (isLoading) return "bg-blue-100";
        if (success) return "bg-green-100";
        return "bg-red-100";
    };

    const getTitle = () => {
        if (isLoading) return "Verifying Magic Link...";
        if (success) return "Welcome Back! 🎉";
        return "Verification Failed";
    };

    const getDescription = () => {
        if (isLoading) return "Please wait while we verify your magic link";
        if (success)
            return "You have been successfully signed in. Redirecting to dashboard...";
        return "There was a problem verifying your magic link";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div
                        className={`mx-auto mb-4 p-3 rounded-full w-fit ${getStatusColor()}`}
                    >
                        {getStatusIcon()}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {getTitle()}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {getDescription()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <>
                            <AlertMessage type="error" message={error} />

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground text-center">
                                    This could happen if:
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                                    <li>
                                        • The link has expired (links expire
                                        after 10 minutes)
                                    </li>
                                    <li>• The link has already been used</li>
                                    <li>• A newer magic link was requested</li>
                                    <li>• The link is malformed or invalid</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <Button asChild className="w-full">
                                    <Link to={NavigationPaths.AUTH_SIGNIN}>
                                        Request New Magic Link
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Link to={NavigationPaths.AUTH_SIGNIN}>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Sign In
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 text-center">
                                🎉 Authentication successful! You will be
                                redirected to your dashboard shortly.
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 text-center">
                                🔐 Securely verifying your identity...
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
