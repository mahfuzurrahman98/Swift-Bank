import type { Step } from "@/utils/interfaces/step-interfaces";
import { StepStatus, StepAgreementStatus } from "@/utils/enums/step";

export const getStepStatus = (step: Step) => {
    // Steps are now containers, status is based on their overall status field
    const isCompleted = step.status === StepStatus.COMPLETED;
    const isPending = step.status === StepStatus.ON_GOING || step.status === StepStatus.ON_HOLD;
    const isDeclined = step.status === StepStatus.TERMINATED;

    return { isCompleted, isDeclined, isPending };
};

export const isStepCompleted = (step: Step) => {
    // Check if step status is manually set to completed
    if (step.status === StepStatus.COMPLETED) {
        return true;
    }
    
    // If there are no substeps, step cannot be auto-completed via substep agreements
    if (!step.subSteps || step.subSteps.length === 0) {
        return false;
    }
    
    // Check if all substeps are agreed upon by both parties (auto-completion)
    const allSubStepsCompleted = step.subSteps.every(subStep => 
        subStep.agreedByInitiator === StepAgreementStatus.AGREED && 
        subStep.agreedByOtherVendor === StepAgreementStatus.AGREED
    );
    
    return allSubStepsCompleted;
};

export const isStepAutoCompleted = (step: Step) => {
    // If step is not completed, it's definitely not auto-completed
    if (step.status !== StepStatus.COMPLETED) {
        return false;
    }
    
    // If there are no substeps, step cannot be auto-completed
    if (!step.subSteps || step.subSteps.length === 0) {
        return false;
    }
    
    // Check if all substeps are agreed upon by both parties
    const allSubStepsCompleted = step.subSteps.every(subStep => 
        subStep.agreedByInitiator === StepAgreementStatus.AGREED && 
        subStep.agreedByOtherVendor === StepAgreementStatus.AGREED
    );
    
    return allSubStepsCompleted;
};

export const getStepCircleStyles = (step: Step) => {
    const { isCompleted, isPending } = getStepStatus(step);

    if (isCompleted) {
        return "bg-green-50 border-green-500 text-green-600";
    }
    if (isPending) {
        return "bg-blue-50 border-blue-400 text-blue-700";
    }
    return "bg-muted border-muted-foreground text-muted-foreground";
};
