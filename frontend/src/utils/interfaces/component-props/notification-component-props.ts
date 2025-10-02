import type { INotification } from "@/utils/interfaces/notification-interfaces";

export interface NotificationItemProps {
    index: number;
    notification: INotification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onNavigate: (url?: string) => void;
}
