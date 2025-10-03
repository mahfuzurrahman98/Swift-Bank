import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    magicLinkSchema,
    type MagicLinkPayload,
} from "@/utils/schemas/auth-schema";
import { Loader, Mail, CheckCircle } from "lucide-react";
import { AuthService } from "@/services/auth-services";
import { logger } from "@/utils/helpers/logger";

export function MagicLinkFormComponent() {
    const [success, setSuccess] = useState(false);
    const form = useForm<MagicLinkPayload>({
        resolver: zodResolver(magicLinkSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (input: MagicLinkPayload) => {
        try {
            await AuthService.requestMagicLink(input);
            setSuccess(true);
            toast.success("Magic link sent to your email!");
        } catch (error: any) {
            logger.error("Error requesting magic link:", error);
            toast.error(error.message || "Failed to send magic link");
        }
    };

    if (success) {
        return (
            <div className="space-y-4">
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            Check Your Email
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            We've sent a magic link to{" "}
                            <span className="font-medium">
                                {form.getValues("email")}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Button
                        onClick={() => setSuccess(false)}
                        variant="outline"
                        className="w-full"
                    >
                        Send Another Link
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader className="size-4 animate-spin mr-2" />
                                Sending Magic Link...
                            </>
                        ) : (
                            <>
                                <Mail className="size-4 mr-2" />
                                Send Magic Link
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </>
    );
}
