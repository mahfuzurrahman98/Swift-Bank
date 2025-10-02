import type { ProjectsResponse } from "@/utils/interfaces/project-interfaces";
import type { Project } from "@/utils/interfaces/project-interfaces";

export interface ProjectsResponseProps extends ProjectsResponse {
    showSearchAndFilters?: boolean;
    refetchProjects: () => Promise<void>;
}

export interface ProjectCreateModalComponentProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    refetchProjects: () => Promise<void>;
}

export interface ProjectLogsModalComponentProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

export interface ProjectDeleteModalComponentProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onDeleteSuccess: () => Promise<void>;
}
