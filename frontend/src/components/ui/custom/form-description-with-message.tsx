import { FormDescription } from "@/components/ui/form";
import { type ControllerRenderProps } from "react-hook-form";

export function FormDescriptionWithMessage({
    maxChars,
    field,
}: {
    maxChars: number;
    field: ControllerRenderProps<any, any>;
}) {
    return (
        field.value && (
            <FormDescription
                className={`${
                    maxChars - field.value.length == 0
                        ? "text-yellow-700 dark:text-yellow-500"
                        : "text-muted-foreground"
                }`}
            >
                Maximum {maxChars} characters, (Remaining{" "}
                {maxChars - field.value.length})
            </FormDescription>
        )
    );
}
