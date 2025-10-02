import type {
    Invitation,
    ReceivedInvitationResponse,
    SentInvitationResponse,
} from "@/utils/interfaces/invitation-interfaces";
import type { SelectOption } from "@/utils/interfaces/option-interface";

export interface ConfirmInvitationComponentProps {
    invitation: Invitation;
    token: string;
    acceptMessagesTemplate: string[];
    declineMessagesTemplate: string[];
}

export interface CreateInvitationFormComponentProps {
    projectOptions: SelectOption[];
    companyOptions: SelectOption[];
}

export interface ReceivedInvitationListingComponentProps
    extends ReceivedInvitationResponse {
    showSearchAndFilters?: boolean;
}

export interface SentInvitationDetailsComponentProps {
    invitation: Invitation;
    onCancelInvitation: () => void;
    isCancelling: boolean;
}

export interface SentInvitationListingComponentProps
    extends SentInvitationResponse {
    showSearchAndFilters?: boolean;
}
