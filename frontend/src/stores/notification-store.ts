import { create } from "zustand";
import { NotificationStatus } from "@/utils/enums/notification";
import type {
    INotification,
    NotificationState,
} from "@/utils/interfaces/notification-interfaces";

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    hasMore: true,
    offset: 0,
    limit: 20,

    setNotifications: (notifications: INotification[]) =>
        set({ notifications }),

    addNotification: (notification: INotification) =>
        set((state) => {
            // Check if notification already exists to prevent duplicates
            const existingNotification = state.notifications.find(
                (n) => n.id === notification.id
            );
            if (existingNotification) {
                console.log(
                    "🔄 Duplicate notification prevented:",
                    notification.id
                );
                return state; // Return unchanged state
            }

            return {
                notifications: [notification, ...state.notifications],
                unreadCount:
                    notification.status === "unread"
                        ? state.unreadCount + 1
                        : state.unreadCount,
            };
        }),

    markAsRead: (notificationId: string) =>
        set((state) => {
            const updatedNotifications = state.notifications.map(
                (notification) =>
                    notification.id === notificationId
                        ? {
                              ...notification,
                              status: NotificationStatus.READ,
                              readAt: new Date().toISOString(),
                          }
                        : notification
            );

            const wasUnread =
                state.notifications.find((n) => n.id === notificationId)
                    ?.status === "unread";
            const newUnreadCount = wasUnread
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount;

            return {
                notifications: updatedNotifications,
                unreadCount: newUnreadCount,
            };
        }),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((notification) => ({
                ...notification,
                status: NotificationStatus.READ,
                readAt:
                    notification.status === "unread"
                        ? new Date().toISOString()
                        : notification.readAt,
            })),
            unreadCount: 0,
        })),

    removeNotification: (notificationId: string) =>
        set((state) => {
            const notificationToRemove = state.notifications.find(
                (n) => n.id === notificationId
            );
            const wasUnread = notificationToRemove?.status === "unread";

            return {
                notifications: state.notifications.filter(
                    (n) => n.id !== notificationId
                ),
                unreadCount: wasUnread
                    ? Math.max(0, state.unreadCount - 1)
                    : state.unreadCount,
            };
        }),

    setUnreadCount: (count: number) => set({ unreadCount: count }),

    setIsLoading: (loading: boolean) => set({ isLoading: loading }),

    setHasMore: (hasMore: boolean) => set({ hasMore }),

    incrementOffset: () =>
        set((state) => ({ offset: state.offset + state.limit })),

    resetPagination: () => set({ offset: 0, hasMore: true }),

    clearNotifications: () =>
        set({
            notifications: [],
            unreadCount: 0,
            offset: 0,
            hasMore: true,
        }),

    revertMarkAsRead: (notificationId: string) =>
        set((state) => {
            const updatedNotifications = state.notifications.map(
                (notification) =>
                    notification.id === notificationId
                        ? {
                              ...notification,
                              status: NotificationStatus.UNREAD,
                              readAt: undefined,
                          }
                        : notification
            );

            const wasRead =
                state.notifications.find((n) => n.id === notificationId)
                    ?.status === "read";
            const newUnreadCount = wasRead
                ? state.unreadCount + 1
                : state.unreadCount;

            return {
                notifications: updatedNotifications,
                unreadCount: newUnreadCount,
            };
        }),

    revertDelete: (notification: INotification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            ),
            unreadCount:
                notification.status === "unread"
                    ? state.unreadCount + 1
                    : state.unreadCount,
        })),
}));
