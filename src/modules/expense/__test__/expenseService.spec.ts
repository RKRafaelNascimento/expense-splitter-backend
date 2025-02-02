import { ExpenseService, ExpenseRepository } from "@/modules/expense";
import { ExpenseSplitService } from "@/modules/expenseSplit";
import { GroupMemberService } from "@/modules/groupMember";
import { BadRequestError } from "@/shared/errors";
import { expenseErrorCodes } from "@/modules/expense/errors";
import { Prisma } from "@prisma/client";

describe("ExpenseService", () => {
  let expenseService: ExpenseService;
  let expenseRepository: jest.Mocked<ExpenseRepository>;
  let expenseSplitService: jest.Mocked<ExpenseSplitService>;
  let groupMemberService: jest.Mocked<GroupMemberService>;

  beforeEach(() => {
    expenseRepository = {
      create: jest.fn(),
      findByIdAndGroup: jest.fn(),
      markAsPaid: jest.fn(),
      findPendingExpensesAndSplitsOwedToMember: jest.fn(),
      findUnpaidExpensesAndSplitsYouOwe: jest.fn(),
    } as unknown as jest.Mocked<ExpenseRepository>;

    expenseSplitService = {
      create: jest.fn(),
      getSplitsByExpense: jest.fn(),
    } as unknown as jest.Mocked<ExpenseSplitService>;

    groupMemberService = {
      findMembersByGroupId: jest.fn(),
      findByGroupAndMember: jest.fn(),
    } as unknown as jest.Mocked<GroupMemberService>;

    expenseService = new ExpenseService(
      expenseRepository,
      expenseSplitService,
      groupMemberService,
    );

    // @ts-expect-error ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    expenseService["prisma"].$transaction = jest.fn(async (cb: Function) => {
      const dummyTransaction = {};
      return cb(dummyTransaction);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Method: create", () => {
    it("should create an expense with provided memberIds", async () => {
      const expenseData = {
        groupId: 1,
        amount: 100,
        name: "Dinner",
        memberId: 10,
        memberIds: [20, 30],
      };

      groupMemberService.findByGroupAndMember
        .mockResolvedValueOnce({
          id: 1,
          groupId: 1,
          memberId: 20,
          createdAt: new Date(),
        })

        .mockResolvedValueOnce({
          id: 2,
          groupId: 1,
          memberId: 30,
          createdAt: new Date(),
        });

      const createdExpense = {
        id: 1,
        ...expenseData,
        paid: false,
        createdBy: expenseData.memberId,
        createdAt: new Date(),
      };

      expenseRepository.create.mockResolvedValue(createdExpense);
      expenseSplitService.create.mockResolvedValue({
        id: 1,
        expenseId: 1,
        memberId: 1,
        splitAmount: 50,
        paid: false,
        createdAt: new Date(),
      });

      const result = await expenseService.create(expenseData);

      expect(result).toEqual(createdExpense);
      expect(expenseRepository.create).toHaveBeenCalledWith(
        {
          name: expenseData.name,
          createdBy: expenseData.memberId,
          amount: expenseData.amount,
          groupId: expenseData.groupId,
        },
        expect.any(Object),
      );
      expect(expenseSplitService.create).toHaveBeenCalledTimes(2);
      expect(groupMemberService.findByGroupAndMember).toHaveBeenCalledWith(
        expenseData.groupId,
        20,
      );
      expect(groupMemberService.findByGroupAndMember).toHaveBeenCalledWith(
        expenseData.groupId,
        30,
      );
    });

    it("should create an expense when memberIds are not provided", async () => {
      const expenseData = {
        groupId: 1,
        amount: 90,
        name: "Lunch",
        memberId: 10,
      };

      groupMemberService.findMembersByGroupId.mockResolvedValue([
        {
          memberId: 10,
          id: 0,
          groupId: 0,
          createdAt: new Date(),
        },
        {
          memberId: 20,
          id: 0,
          groupId: 0,
          createdAt: new Date(),
        },
        {
          memberId: 30,
          id: 0,
          groupId: 0,
          createdAt: new Date(),
        },
      ]);

      const createdExpense = {
        id: 2,
        ...expenseData,
        paid: false,
        createdBy: expenseData.memberId,
        createdAt: new Date(),
      };
      expenseRepository.create.mockResolvedValue(createdExpense);
      expenseSplitService.create.mockResolvedValue({
        id: 2,
        expenseId: 2,
        memberId: 10,
        splitAmount: 45,
        paid: false,
        createdAt: new Date(),
      });

      const result = await expenseService.create(expenseData);

      expect(result).toEqual(createdExpense);
      expect(groupMemberService.findMembersByGroupId).toHaveBeenCalledWith(
        expenseData.groupId,
      );
      expect(expenseSplitService.create).toHaveBeenCalledTimes(2);
    });

    it("should throw an error if self member is included in memberIds", async () => {
      const expenseData = {
        groupId: 1,
        amount: 50,
        name: "Snack",
        memberId: 10,
        memberIds: [10, 20],
      };

      await expect(expenseService.create(expenseData)).rejects.toThrowError(
        new BadRequestError(
          "You cannot include yourself in the expense.",
          expenseErrorCodes.CANNOT_BE_YOURSELF_MEMBERID,
        ),
      );

      expect(expenseRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if a member is not found in the group", async () => {
      const expenseData = {
        groupId: 1,
        amount: 75,
        name: "Drinks",
        memberId: 10,
        memberIds: [20, 30],
      };

      groupMemberService.findByGroupAndMember
        .mockResolvedValueOnce({
          id: 1,
          groupId: 1,
          memberId: 20,
          createdAt: new Date(),
        })
        .mockResolvedValueOnce(null);

      await expect(expenseService.create(expenseData)).rejects.toThrowError(
        new BadRequestError(
          `Member with ID 30 not found in group 1`,
          expenseErrorCodes.MEMBER_NOT_FOUND_IN_GROUP,
        ),
      );

      expect(expenseRepository.create).not.toHaveBeenCalled();
      expect(expenseSplitService.create).not.toHaveBeenCalled();
    });
  });
  describe("Method: markAsPaid", () => {
    it("should throw an error if the expense is not found or does not belong to the group", async () => {
      expenseRepository.findByIdAndGroup.mockResolvedValue(null);

      await expect(expenseService.markAsPaid(1, 1)).rejects.toThrowError(
        new BadRequestError(
          "Expense not found or does not belong to the group.",
          expenseErrorCodes.EXPENSE_NOT_FOUND,
        ),
      );

      expect(expenseRepository.findByIdAndGroup).toHaveBeenCalledWith(1, 1);
    });

    it("should return undefined if not all splits are paid", async () => {
      const expense = {
        id: 1,
        groupId: 1,
        name: "Test Expense",
        amount: 100,
        paid: false,
        createdBy: 1,
        createdAt: new Date(),
      };
      expenseRepository.findByIdAndGroup.mockResolvedValue(expense);
      expenseSplitService.getSplitsByExpense.mockResolvedValue([
        {
          paid: true,
          id: 0,
          expenseId: 0,
          memberId: 0,
          splitAmount: 0,
          createdAt: new Date(),
        },
        {
          paid: false,
          id: 0,
          expenseId: 0,
          memberId: 0,
          splitAmount: 0,
          createdAt: new Date(),
        },
      ]);

      const result = await expenseService.markAsPaid(1, 1);
      expect(result).toBeUndefined();
    });

    it("should mark the expense as paid and return the updated expense when all splits are paid", async () => {
      const expense = {
        id: 1,
        groupId: 1,
        name: "Test Expense",
        amount: 100,
        paid: false,
        createdBy: 1,
        createdAt: new Date(),
      };
      const updatedExpense = {
        id: 1,
        groupId: 1,
        name: "Test Expense",
        amount: 100,
        paid: true,
        createdBy: 1,
        createdAt: new Date(),
      };

      expenseRepository.findByIdAndGroup.mockResolvedValue(expense);
      expenseSplitService.getSplitsByExpense.mockResolvedValue([
        {
          paid: true,
          id: 0,
          expenseId: 0,
          memberId: 0,
          splitAmount: 0,
          createdAt: new Date(),
        },
        {
          paid: true,
          id: 0,
          expenseId: 0,
          memberId: 0,
          splitAmount: 0,
          createdAt: new Date(),
        },
      ]);
      expenseRepository.markAsPaid.mockResolvedValue(updatedExpense);

      const dummyTransaction = {} as Prisma.TransactionClient;

      const result = await expenseService.markAsPaid(1, 1, dummyTransaction);
      expect(result).toEqual(updatedExpense);
      expect(expenseRepository.markAsPaid).toHaveBeenCalledWith(
        1,
        dummyTransaction,
      );
    });
  });
  describe("Method: splitAmountAmongMembers", () => {
    it("should correctly split the total amount among members", () => {
      const memberIds = [20, 30, 40];
      const totalAmount = 100;

      const splits: Array<{ memberId: number; splitAmount: number }> = (
        expenseService as any
      ).splitAmountAmongMembers(memberIds, totalAmount);

      expect(splits).toHaveLength(3);
      expect(splits[0]).toEqual({ memberId: 20, splitAmount: 33.34 });
      expect(splits[1]).toEqual({ memberId: 30, splitAmount: 33.33 });
      expect(splits[2]).toEqual({ memberId: 40, splitAmount: 33.33 });
    });
  });
});
