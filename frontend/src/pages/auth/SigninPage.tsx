import { MagicLinkFormComponent } from "@/components/auth/MagicLinkFormComponent";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function SigninPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Sign in to Swift Bank
                </CardTitle>
                <CardDescription>
                    Enter your email to receive a magic link for secure sign-in
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MagicLinkFormComponent />
            </CardContent>
        </Card>
    );
}
