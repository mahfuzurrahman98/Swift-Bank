import { MessageCircle, X } from "lucide-react";
import { toast as sonnerToast } from "sonner";

interface ToastProps {
    id: string | number;
    title: string;
    description: string;
    button: {
        label: string;
        onClick: () => void;
    };
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
    const { title, description, button, id } = props;

    return (
        <div className="flex rounded-xl bg-blue-50/80 dark:bg-blue-900/70 shadow-xl border border-blue-200/60 dark:border-blue-600/50 w-full md:max-w-[400px] items-start p-4 gap-3 backdrop-blur-md">
            {/* Chat Icon */}
            <div className="flex-shrink-0 mt-0.5">
                <div className="size-8 bg-blue-500/20 dark:bg-blue-400/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="size-5 text-blue-700 dark:text-blue-300" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-900 dark:text-white leading-tight">
                            {title}
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                        <button
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-sm cursor-pointer"
                            onClick={() => {
                                button.onClick();
                                sonnerToast.dismiss(id);
                            }}
                        >
                            {button.label}
                        </button>
                    </div>
                </div>
                <p className="mt-1 text-sm text-blue-700/80 dark:text-blue-100 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Dismiss Button */}
            <button
                className="flex-shrink-0 p-1 text-blue-400 hover:text-blue-600 dark:text-blue-200 dark:hover:text-white transition-colors duration-200"
                onClick={() => sonnerToast.dismiss(id)}
            >
                <X className="size-4" />
            </button>
        </div>
    );
}

export function toastChatMessage(toast: Omit<ToastProps, "id">) {
    return sonnerToast.custom((id) => (
        <Toast
            id={id}
            title={toast.title}
            description={toast.description}
            button={{
                label: toast.button.label,
                onClick: () => {
                    toast.button.onClick && toast.button.onClick();
                },
            }}
        />
    ));
}
