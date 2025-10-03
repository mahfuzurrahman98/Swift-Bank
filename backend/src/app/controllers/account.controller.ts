import { NextFunction, Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { AccountService } from "@/app/services/account.service";
import { formatError } from "@/utils/helpers/error-formatter";
import { ApiResponseDTO } from "@/app/dtos/common.dto";
import {
    depositSchema,
    withdrawSchema,
    transferSchema,
    addBeneficiarySchema,
    beneficiaryIdParamSchema,
    transactionsQueryParamsSchema,
} from "@/app/schemas/account.schema";
import { RequestUser } from "@/app/interfaces/auth.interface";
import {
    AccountResponseDTO,
    AddBeneficiaryRequestDTO,
    BeneficiariesResponseDTO,
    BeneficiaryIdParamDTO,
    BeneficiaryQueryParams,
    DeleteBeneficiaryResponseDTO,
    DepositRequestDTO,
    DepositResponseDTO,
    TransactionQueryParams,
    TransferRequestDTO,
    TransferResponseDTO,
    WithdrawRequestDTO,
    WithdrawResponseDTO,
} from "@/app/dtos/account.dto";
import { BeneficiaryService } from "../services/beneficiary.service";

/**
 * Controller class handling account-related HTTP requests.
 */
@autoInjectable()
export class AccountsController {
    private accountService: AccountService;
    private beneficiaryService: BeneficiaryService;

    /**
     * Constructor for AccountsController.
     *
     * @param accountService - Service handling account business logic
     */
    constructor(
        accountService: AccountService,
        beneficiaryService: BeneficiaryService
    ) {
        this.accountService = accountService;
        this.beneficiaryService = beneficiaryService;
    }

    /**
     * Gets user account with beneficiaries.
     *
     * @param request - Express request
     * @param response - Express response
     * @param next - Express next middleware function
     */
    getAccount = async (
        request: Request,
        response: Response<AccountResponseDTO>,
        next: NextFunction
    ) => {
        try {
            const user = request.user as RequestUser;
            const userId = user._id;

            const account = await this.accountService.getAccount(userId);

            response.status(200).json({
                message: "Account fetched successfully",
                data: { account },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Handles money deposit.
     *
     * @param request - Express request with deposit data
     * @param response - Express response
     * @param next - Express next middleware function
     */
    deposit = async (
        request: Request<{}, {}, DepositRequestDTO>,
        response: Response<DepositResponseDTO>,
        next: NextFunction
    ) => {
        try {
            // Validate request body
            const { amount }: DepositRequestDTO = depositSchema.parse(
                request.body
            );

            const user = request.user as RequestUser;
            const userId = user._id;

            const { account, transaction } = await this.accountService.deposit(
                userId,
                amount
            );

            response.status(200).json({
                message: "Deposit successful",
                data: {
                    account,
                    transaction,
                },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Handles money withdrawal.
     *
     * @param request - Express request with withdrawal data
     * @param response - Express response
     * @param next - Express next middleware function
     */
    withdraw = async (
        request: Request<{}, {}, WithdrawRequestDTO>,
        response: Response<WithdrawResponseDTO>,
        next: NextFunction
    ) => {
        try {
            // Validate request body
            const { amount }: WithdrawRequestDTO = withdrawSchema.parse(
                request.body
            );

            const user = request.user as RequestUser;
            const userId = user._id;

            const { account, transaction } = await this.accountService.withdraw(
                userId,
                amount
            );

            response.status(200).json({
                message: "Withdrawal successful",
                data: {
                    account,
                    transaction,
                },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Handles money transfer between accounts.
     *
     * @param request - Express request with transfer data
     * @param response - Express response
     * @param next - Express next middleware function
     */
    transfer = async (
        request: Request<{}, {}, TransferRequestDTO>,
        response: Response<TransferResponseDTO>,
        next: NextFunction
    ) => {
        try {
            // Validate request body
            const validatedData = transferSchema.parse(request.body);

            const user = request.user as RequestUser;
            const userId = user._id;

            const { fromAccount, toAccount, transaction } =
                await this.accountService.transfer(userId, validatedData);

            response.status(200).json({
                message: "Transfer successful",
                data: {
                    fromAccount,
                    toAccount,
                    transaction,
                },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Adds a beneficiary to user's account.
     *
     * @param request - Express request with beneficiary data
     * @param response - Express response
     * @param next - Express next middleware function
     */
    addBeneficiary = async (
        request: Request<{}, AccountResponseDTO, AddBeneficiaryRequestDTO>,
        response: Response<AccountResponseDTO>,
        next: NextFunction
    ) => {
        try {
            const user = request.user as RequestUser;
            const userId = user._id;

            // Validate request body using schema
            const validatedBody: AddBeneficiaryRequestDTO =
                addBeneficiarySchema.parse(request.body);
            const { beneficiaryId } = validatedBody;

            const account = await this.beneficiaryService.addBeneficiary(
                userId,
                beneficiaryId
            );

            response.status(200).json({
                message: "Beneficiary added successfully",
                data: { account },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Gets all beneficiaries for user's account.
     *
     * @param request - Express request
     * @param response - Express response
     * @param next - Express next middleware function
     */
    getBeneficiaries = async (
        request: Request<
            {},
            BeneficiariesResponseDTO,
            {},
            BeneficiaryQueryParams
        >,
        response: Response<BeneficiariesResponseDTO>,
        next: NextFunction
    ) => {
        try {
            const user = request.user as RequestUser;
            const userId = user._id;

            // Extract and validate query parameters
            const queryParams: BeneficiaryQueryParams = {
                page: request.query.page
                    ? parseInt(request.query.page.toString())
                    : 1,
                limit: request.query.limit
                    ? parseInt(request.query.limit.toString())
                    : 10,
                q: request.query.q?.toString(),
            };

            const { beneficiaries, meta } =
                await this.beneficiaryService.getBeneficiaries(
                    userId,
                    queryParams
                );

            response.status(200).json({
                message: "Beneficiaries fetched successfully",
                data: { beneficiaries, meta },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Removes a beneficiary from user's account.
     *
     * @param request - Express request with beneficiary ID in params
     * @param response - Express response
     * @param next - Express next middleware function
     */
    deleteBeneficiary = async (
        request: Request<BeneficiaryIdParamDTO, DeleteBeneficiaryResponseDTO>,
        response: Response<DeleteBeneficiaryResponseDTO>,
        next: NextFunction
    ) => {
        try {
            const user = request.user as RequestUser;
            const userId = user._id;

            // Validate request params using schema
            const validatedParams: BeneficiaryIdParamDTO =
                beneficiaryIdParamSchema.parse(request.params);
            const beneficiaryId = validatedParams._id;

            await this.beneficiaryService.deleteBeneficiary(
                userId,
                beneficiaryId
            );

            response.status(200).json({
                message: "Beneficiary deleted successfully",
                data: {},
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Gets all transactions for user's account.
     *
     * @param request - Express request
     * @param response - Express response
     * @param next - Express next middleware function
     */
    getTransactions = async (
        request: Request<{}, {}, {}, TransactionQueryParams>,
        response: Response<ApiResponseDTO>,
        next: NextFunction
    ) => {
        try {
            const user = request.user as RequestUser;
            const userId = user._id;

            const filters: TransactionQueryParams =
                transactionsQueryParamsSchema.parse(request.query);

            const { transactions, meta } =
                await this.accountService.getTransactions(userId, filters);

            response.status(200).json({
                message: "Transactions fetched successfully",
                data: {
                    transactions,
                    meta,
                },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };
}
