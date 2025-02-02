import { NotFoundError, BadRequestError } from "@/shared/errors";
import { paymentErrorCodes } from "@/modules/payment/errors";
import { PaymentService } from "@/modules/payment";
import { IExpense, IExpenseService } from "@/modules/expense/interfaces";
import { IExpenseSplitService } from "@/modules/expenseSplit/interfaces";
import { IDatabaseClient } from "@/infra/interfaces";
import { IBalanceService } from "@/modules/balance/interfaces";

describe("PaymentService", () => {
  let paymentService: PaymentService;
  let mockExpenseService: jest.Mocked<IExpenseService>;
  let mockExpenseSplitService: jest.Mocked<IExpenseSplitService>;
  let mockDatabaseClient: jest.Mocked<IDatabaseClient>;
  let mockBalanceService: jest.Mocked<IBalanceService>;

  const dummyTransaction = {};

  beforeEach(() => {
    mockExpenseService = {
      findByIdAndGroup: jest.fn(),
      markAsPaid: jest.fn(),
    } as unknown as jest.Mocked<IExpenseService>;

    mockExpenseSplitService = {
      getSplitsByExpense: jest.fn(),
      markAsPaid: jest.fn(),
    } as unknown as jest.Mocked<IExpenseSplitService>;

    const dummyOrmClient = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      $transaction: jest.fn(async (callback: Function) => {
        return callback(dummyTransaction);
      }),
    };

    mockDatabaseClient = {
      getOrmClient: jest.fn().mockReturnValue(dummyOrmClient),
    } as unknown as jest.Mocked<IDatabaseClient>;

    mockBalanceService = {
      transfer: jest.fn(),
    } as unknown as jest.Mocked<IBalanceService>;

    paymentService = new PaymentService(
      mockExpenseService,
      mockExpenseSplitService,
      mockDatabaseClient,
      mockBalanceService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("PaymenetService", () => {
    describe("Method: payExpense", () => {
      it("should transfer money, mark expense split and expense as paid when valid", async () => {
        const paymentData = { groupId: 1, expenseId: 10, memberId: 100 };
        const expense: IExpense = {
          id: 1,
          groupId: 1,
          name: "Test Expense",
          amount: 100,
          paid: false,
          createdBy: 1,
          createdAt: new Date(),
        };
        mockExpenseService.findByIdAndGroup.mockResolvedValue(expense);

        const expenseSplits = [
          {
            id: 50,
            expenseId: paymentData.expenseId,
            memberId: paymentData.memberId,
            splitAmount: 40,
            paid: false,
            createdAt: new Date(),
          },
          {
            id: 51,
            expenseId: paymentData.expenseId,
            memberId: 300,
            splitAmount: 60,
            paid: false,
            createdAt: new Date(),
          },
        ];
        mockExpenseSplitService.getSplitsByExpense.mockResolvedValue(
          expenseSplits,
        );

        mockBalanceService.transfer.mockResolvedValue(undefined);
        mockExpenseSplitService.markAsPaid.mockResolvedValue({
          id: 1,
          expenseId: 1,
          memberId: 1,
          splitAmount: 50,
          paid: true,
          createdAt: new Date(),
        });
        mockExpenseService.markAsPaid.mockResolvedValue({
          ...expense,
          paid: true,
        });

        await paymentService.payExpense(paymentData);

        expect(mockExpenseService.findByIdAndGroup).toHaveBeenCalledWith(
          paymentData.expenseId,
          paymentData.groupId,
        );
        expect(mockExpenseSplitService.getSplitsByExpense).toHaveBeenCalledWith(
          paymentData.expenseId,
        );
        expect(mockBalanceService.transfer).toHaveBeenCalledWith(
          {
            senderId: paymentData.memberId,
            receiverId: expense.createdBy,
            amount: expenseSplits[0].splitAmount,
            groupId: paymentData.groupId,
          },
          dummyTransaction,
        );
        expect(mockExpenseSplitService.markAsPaid).toHaveBeenCalledWith(
          expenseSplits[0].id,
          dummyTransaction,
        );
        expect(mockExpenseService.markAsPaid).toHaveBeenCalledWith(
          expense.id,
          paymentData.groupId,
          dummyTransaction,
        );
      });

      it("should throw NotFoundError if expense is not found", async () => {
        const paymentData = { groupId: 1, expenseId: 10, memberId: 100 };
        mockExpenseService.findByIdAndGroup.mockResolvedValue(null);

        await expect(
          paymentService.payExpense(paymentData),
        ).rejects.toThrowError(
          new NotFoundError(
            "Expense not found or does not belong to the group.",
            paymentErrorCodes.EXPENSE_NOT_FOUND,
          ),
        );
        expect(mockExpenseService.findByIdAndGroup).toHaveBeenCalledWith(
          paymentData.expenseId,
          paymentData.groupId,
        );
        expect(mockBalanceService.transfer).not.toHaveBeenCalled();
        expect(
          mockExpenseSplitService.getSplitsByExpense,
        ).not.toHaveBeenCalled();
      });

      it("should throw BadRequestError if expense is already paid", async () => {
        const paymentData = { groupId: 1, expenseId: 10, memberId: 100 };
        const expense: IExpense = {
          id: paymentData.expenseId,
          groupId: paymentData.groupId,
          name: "Test Expense",
          amount: 100,
          paid: true,
          createdBy: 200,
          createdAt: new Date(),
        };
        mockExpenseService.findByIdAndGroup.mockResolvedValue(expense);

        await expect(
          paymentService.payExpense(paymentData),
        ).rejects.toThrowError(
          new BadRequestError(
            "The expense has already been paid.",
            paymentErrorCodes.EXPENSE_ALREADY_PAID,
          ),
        );
        expect(mockExpenseService.findByIdAndGroup).toHaveBeenCalledWith(
          paymentData.expenseId,
          paymentData.groupId,
        );
        expect(
          mockExpenseSplitService.getSplitsByExpense,
        ).not.toHaveBeenCalled();
        expect(mockBalanceService.transfer).not.toHaveBeenCalled();
      });

      it("should throw NotFoundError if no expense split found for the member", async () => {
        const paymentData = { groupId: 1, expenseId: 10, memberId: 100 };
        const expense: IExpense = {
          id: paymentData.expenseId,
          groupId: paymentData.groupId,
          name: "Test Expense",
          amount: 100,
          paid: false,
          createdBy: 200,
          createdAt: new Date(),
        };

        mockExpenseService.findByIdAndGroup.mockResolvedValue(expense);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const expenseSplits: any[] = [];
        mockExpenseSplitService.getSplitsByExpense.mockResolvedValue(
          expenseSplits,
        );

        await expect(
          paymentService.payExpense(paymentData),
        ).rejects.toThrowError(
          new NotFoundError(
            "No split found for this member.",
            paymentErrorCodes.NO_SPLIT_FOUND,
          ),
        );
        expect(mockExpenseSplitService.getSplitsByExpense).toHaveBeenCalledWith(
          paymentData.expenseId,
        );
        expect(mockBalanceService.transfer).not.toHaveBeenCalled();
      });

      it("should throw BadRequestError if the expense split is already paid", async () => {
        const paymentData = { groupId: 1, expenseId: 10, memberId: 100 };
        const expense: IExpense = {
          id: paymentData.expenseId,
          groupId: paymentData.groupId,
          name: "Test Expense",
          amount: 100,
          paid: false,
          createdBy: 200,
          createdAt: new Date(),
        };

        mockExpenseService.findByIdAndGroup.mockResolvedValue(expense);

        const expenseSplits = [
          {
            id: 50,
            expenseId: paymentData.expenseId,
            memberId: paymentData.memberId,
            splitAmount: 40,
            paid: true,
            createdAt: new Date(),
          },
        ];

        mockExpenseSplitService.getSplitsByExpense.mockResolvedValue(
          expenseSplits,
        );

        await expect(
          paymentService.payExpense(paymentData),
        ).rejects.toThrowError(
          new BadRequestError(
            "This expense is already paid.",
            paymentErrorCodes.EXPENSE_SPLIT_ALREADY_PAID,
          ),
        );
        expect(mockExpenseSplitService.getSplitsByExpense).toHaveBeenCalledWith(
          paymentData.expenseId,
        );
        expect(mockBalanceService.transfer).not.toHaveBeenCalled();
      });
    });
  });
});
