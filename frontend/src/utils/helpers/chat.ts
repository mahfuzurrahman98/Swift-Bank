import type { ChatStepType } from "@/utils/interfaces/component-props/chat-components-props";

export const getStepType = (content: string): ChatStepType => {
    if (content.endsWith(" has accepted the invitation")) {
        return "invitation_accepted";
    }

    if (content.endsWith(" added step: Confirm")) {
        return "accept";
    }

    if (content.endsWith(" added step: Decline")) {
        return "decline";
    }

    if (content.startsWith("This chat is closed by ")) {
        return "closed";
    }

    if (content.endsWith(" to the chat")) {
        return "member_added";
    }

    if (content.includes(" initiated a step: ")) {
        return "step_initiated";
    }

    if (content.includes(" agreed to step: ")) {
        return "agreed_to_step";
    }

    if (content.includes(" disagreed to step: ")) {
        return "disagreed_to_step";
    }

    if (content.includes(" terminated the stage")) {
        return "terminated";
    }

    return "other";
};

export const checkIfBannerIsStepMessage = (content: string): boolean =>
    content.includes(" initiated a step to ") ||
    content.includes(" added step: ") ||
    content.includes(" agreed to step: ") ||
    content.includes(" disagreed to step: ") ||
    content.includes(" terminated the stage");

export const checkIfBannerIsMemberAddedMessage = (content: string): boolean =>
    content.endsWith(" to the chat");
