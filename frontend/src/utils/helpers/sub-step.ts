import type { SubStep } from "@/utils/interfaces/sub-step-interfaces";
import { StepAgreementStatus } from "@/utils/enums/step";

export const getSubStepStatus = (subStep: SubStep, isInternalChat = false) => {
    if (subStep.name === "Terminate") {
        return {
            isCompleted: true,
            isDeclined: false,
            isPending: false,
        };
    }
    
    // For internal chats, otherVendor is null and agreedByOtherVendor is automatically agreed
    const otherVendorStatus = isInternalChat 
        ? StepAgreementStatus.AGREED 
        : subStep.agreedByOtherVendor;
        
    const isCompleted =
        subStep.agreedByInitiator === StepAgreementStatus.AGREED &&
        otherVendorStatus === StepAgreementStatus.AGREED;

    const isDeclined =
        otherVendorStatus === StepAgreementStatus.NOT_AGREED ||
        subStep.agreedByInitiator === StepAgreementStatus.NOT_AGREED;

    const isPending =
        subStep.agreedByInitiator === null || 
        (!isInternalChat && subStep.agreedByOtherVendor === null);

    return { isCompleted, isDeclined, isPending };
};

export const getSubStepCircleStyles = (subStep: SubStep, isInternalChat = false) => {
    const { isCompleted, isDeclined, isPending } = getSubStepStatus(subStep, isInternalChat);

    if (isCompleted) {
        return "bg-green-50 border-green-500 text-green-600";
    }
    if (isDeclined) {
        return "bg-red-50 border-red-500 text-red-600";
    }
    if (isPending) {
        return "bg-yellow-50 border-yellow-400 text-yellow-700";
    }
    return "bg-muted border-muted-foreground text-muted-foreground";
};