import type {
    Chat,
    ChatMember,
    ChatMessage,
} from "@/utils/interfaces/chat-interfaces";
import type { MessageType } from "@/utils/enums/chat";
import type { UserWithCompany } from "@/utils/interfaces/auth-interfaces";
import type { Stage } from "@/utils/interfaces/stage-interfaces";

export interface ChatCreateModalComponentProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
}

export interface ConnectionStatus {
    connected: boolean;
    authenticated: boolean;
    inRoom: boolean;
}

export interface ChatSidebarProps {
    chats: Chat[];
    unreadCounts?: Record<string, number>;
    selectedChatId?: string;
    onSelectChat: (chatId: string) => void;
}

export interface ChatSidebarItemProps {
    chat: Chat;
    unreadCount?: number;
    isSelected: boolean;
    onSelect: (chatId: string) => void;
}

export interface ChatDetailsSidebarProps {
    chat: Chat;
    chatMembers: ChatMember[];
    stages: Stage[];
    currentChatMember: ChatMember | undefined;
    otherVendor: UserWithCompany | null;
    employees: ChatMember[];
    fetchEmployees: () => Promise<void>;
    isEmployeeLoading: boolean;
    setChatMembers: (members: ChatMember[]) => void;
    onClose: () => void;
    onAddMembers: (memberIds: string[]) => Promise<void>;
    isChatMembersLoading: boolean;
    isStagesLoading: boolean;
}

export interface ChatMembersAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMembers: (memberIds: string[]) => Promise<void>;
    existingMemberIds: string[];
    employees: ChatMember[];
    isEmployeeLoading: boolean;
    setChatMembers: (members: ChatMember[]) => void;
    chatId: string;
}

export interface ChatMessageAreaProps {
    chat?: Chat;
    messages: ChatMessage[];
    currentMember: ChatMember | undefined;
    otherVendor: UserWithCompany | null;
    onSendMessage: (
        content: string,
        type?: MessageType,
        saveMessageToDB?: boolean
    ) => Promise<void>;
    hasMoreMessages: boolean;
    onLoadMoreMessages: () => Promise<void>;
    isLoadingMore: boolean;
    onToggleDetailsSidebar: () => void;
    stages: Stage[];
    setStages: (stages: Stage[]) => void;
    fetchStages: () => Promise<void>;
    isStagesLoading: boolean;
}

export interface ChatMessageBubbleProps {
    message: ChatMessage;
    isCurrentUser: boolean;
}

export type ChatStepType =
    | "accept"
    | "invitation_accepted"
    | "decline"
    | "closed"
    | "member_added"
    | "step_initiated"
    | "agreed_to_step"
    | "disagreed_to_step"
    | "terminated"
    | "other";

export interface OtherOptions {
    isStep: boolean;
    stepType?: ChatStepType;
}

export interface ChatMessageRendererProps {
    message: ChatMessage;
    isCurrentUser: boolean;
    otherOptions?: OtherOptions;
}

export interface ChatImageViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    fileName: string;
    fileSize: number;
}

export interface ChatPdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    fileName: string;
    fileSize: number;
}
