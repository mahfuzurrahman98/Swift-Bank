import type { CompaniesResponse } from "@/utils/interfaces/company-interfaces";

export interface CompanyListingComponentProps extends CompaniesResponse {
    showRegisteredAt?: boolean;
}
