import { AuthLayout } from "@/components/layouts/auth/AuthLayout";
import { toastChatMessage } from "@/components/ui/custom/toast-chat-message";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/custom/alert-message";

export default function TestPage() {
    return (
        <AuthLayout>
            <div>
                <AlertMessage
                    message="This is a test message"
                    title="Test"
                    type="error"
                />
            </div>

            <Button
                onClick={() => {
                    toastChatMessage({
                        title: "Test Message from Intoiit LLC, Texas, USA",
                        description:
                            "This is a test message, a long mesage as well.",
                        button: {
                            label: "Open",
                            onClick: () => console.log("Button clicked"),
                        },
                    });
                }}
            >
                Toast
            </Button>
        </AuthLayout>
    );
}
