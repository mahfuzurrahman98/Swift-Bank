import type { MessageType } from "@/utils/enums/chat";
import type { UserWithCompany } from "@/utils/interfaces/auth-interfaces";
import type { Stage } from "@/utils/interfaces/stage-interfaces";
import type { ChatMember } from "@/utils/interfaces/chat-interfaces";
import type { Step } from "@/utils/interfaces/step-interfaces";
import type { SubStep } from "@/utils/interfaces/sub-step-interfaces";
import type { StepAgreementStatus } from "@/utils/enums/step";
import type { Chat } from "@/utils/interfaces/chat-interfaces";

export interface StageComponentProps {
    chat: Chat;
    currentMember: ChatMember | undefined;
    isStageModalOpen: boolean;
    onStageModalClose: () => void;
    stages: Stage[];
    setStages: (stages: Stage[]) => void;
    fetchStages: () => Promise<void>;
    otherVendor: UserWithCompany | null;
    onSendMessage: (
        content: string,
        messageType?: MessageType,
        saveMessageToDB?: boolean
    ) => Promise<void>;
    isStagesLoading: boolean;
}

export interface StageAddComponentProps {
    chatId: string;
    onStageCreate: (stage: Stage) => void;
}

export interface StepAddComponentProps {
    isOpen: boolean;
    onClose: () => void;
    onStepAdd: (step: Step) => void;
    stage: Stage;
}

export interface SubStepAddComponentProps {
    isOpen: boolean;
    onClose: () => void;
    onSubStepAdd: (subStep: SubStep) => void;
    step: Step;
    otherVendor: UserWithCompany | null;
}

export interface StageAddAIComponentProps {
    isOpen: boolean;
    onClose: () => void;
    chatId: string;
    otherVendor: UserWithCompany | null;
    fetchStages: () => Promise<void>;
    onSendMessage: (
        content: string,
        messageType?: MessageType,
        saveMessageToDB?: boolean
    ) => Promise<void>;
}

export interface StepMilestoneComponentProps {
    stage: Stage;
    stages: Stage[];
    setStages: (stages: Stage[]) => void;
    steps: Step[];
    otherVendor: UserWithCompany | null;
    onSendMessage: (
        content: string,
        messageType?: MessageType,
        saveMessageToDB?: boolean
    ) => Promise<void>;
}

export interface SubStepMilestoneComponentProps {
    step: Step;
    stage: Stage;
    stages: Stage[];
    setStages: (stages: Stage[]) => void;
    subSteps: SubStep[];
    otherVendor: UserWithCompany | null;
    currentMember: ChatMember | undefined;
    onSendMessage: (
        content: string,
        messageType?: MessageType,
        saveMessageToDB?: boolean
    ) => Promise<void>;
    updateLocalSubSteps: (
        stage: Stage,
        step: Step,
        subStep: SubStep,
        agreementStatus: StepAgreementStatus
    ) => void;
}
