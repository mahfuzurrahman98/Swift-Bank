import type { Employee } from "@/utils/interfaces/employee-interfaces";

export interface EmployeesListingComponentProps {
    employees: Employee[];
    resendInvitation: (id: string) => Promise<void>;
    otherLoading: boolean;
}

export interface EmployeeInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefetch: () => Promise<void>;
}
