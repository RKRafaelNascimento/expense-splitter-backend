import { NotFoundError } from "@/shared/errors";
import { balanceErrorCodes } from "@/modules/balance/error";
import { BalanceService } from "@/modules/balance";
import { IBalanceRepository, ITransfer } from "@/modules/balance/interfaces";
import { IGroupMemberService } from "@/modules/groupMember/interfaces";
import { IExpenseService } from "@/modules/expense/interfaces";
import { Prisma } from "@prisma/client";

describe("BalanceService", () => {
  let balanceService: BalanceService;
  let mockBalanceRepository: jest.Mocked<IBalanceRepository>;
  let mockGroupMemberService: jest.Mocked<IGroupMemberService>;
  let mockExpenseService: jest.Mocked<IExpenseService>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dummyTransaction: Prisma.TransactionClient = {} as any;

  beforeEach(() => {
    mockBalanceRepository = {
      get: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<IBalanceRepository>;

    mockGroupMemberService = {
      findMembersWithDetailsByGroupId: jest.fn(),
    } as unknown as jest.Mocked<IGroupMemberService>;

    mockExpenseService = {
      findPendingExpensesAndSplitsOwedToMember: jest
        .fn()
        .mockImplementation((groupId: number, memberId: number) => {
          if (memberId === 1) {
            return Promise.resolve([{ expenseSplits: [{ splitAmount: 20 }] }]);
          }
          if (memberId === 2) {
            return Promise.resolve([{ expenseSplits: [{ splitAmount: 5 }] }]);
          }
          return Promise.resolve([]);
        }),
      findUnpaidExpensesAndSplitsYouOwe: jest
        .fn()
        .mockImplementation((groupId: number, memberId: number) => {
          if (memberId === 1) {
            return Promise.resolve([{ expenseSplits: [{ splitAmount: 10 }] }]);
          }
          if (memberId === 2) {
            return Promise.resolve([{ expenseSplits: [{ splitAmount: 2 }] }]);
          }
          return Promise.resolve([]);
        }),
    } as unknown as jest.Mocked<IExpenseService>;

    balanceService = new BalanceService(
      mockBalanceRepository,
      () => mockGroupMemberService,
      () => mockExpenseService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Method: transfer", () => {
    it("should transfer money when sender has sufficient balance", async () => {
      const transferData: ITransfer = {
        senderId: 1,
        receiverId: 2,
        amount: 40,
        groupId: 1,
      };

      mockBalanceRepository.get.mockImplementation((memberId: number) => {
        if (memberId === 1) return Promise.resolve(100);
        if (memberId === 2) return Promise.resolve(50);
        return Promise.resolve(0);
      });

      mockBalanceRepository.update.mockResolvedValue();

      await balanceService.transfer(transferData, dummyTransaction);

      expect(mockBalanceRepository.update).toHaveBeenCalledWith(
        { memberId: 1, groupId: 1, balance: 100 - 40 },
        dummyTransaction,
      );

      expect(mockBalanceRepository.update).toHaveBeenCalledWith(
        { memberId: 2, groupId: 1, balance: 50 + 40 },
        dummyTransaction,
      );
    });

    it("should throw NotFoundError if sender has insufficient balance", async () => {
      const transferData: ITransfer = {
        senderId: 1,
        receiverId: 2,
        amount: 40,
        groupId: 1,
      };

      mockBalanceRepository.get.mockImplementation((memberId: number) => {
        if (memberId === 1) return Promise.resolve(30);
        if (memberId === 2) return Promise.resolve(50);
        return Promise.resolve(0);
      });

      await expect(
        balanceService.transfer(transferData, dummyTransaction),
      ).rejects.toThrowError(
        new NotFoundError(
          "Insufficient balance to make the transfer.",
          balanceErrorCodes.INSUFFICIENT_BALANCE,
        ),
      );

      expect(mockBalanceRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("Method: getAllBalancesByGroup", () => {
    it("should return all balances with netBalance calculated", async () => {
      const groupId = 1;

      const members = [
        {
          id: 1,
          groupId: 1,
          memberId: 1,
          createdAt: new Date(),
          member: { name: "Test1", email: "test1@example.com" },
        },
        {
          id: 2,
          groupId: 1,
          memberId: 2,
          createdAt: new Date(),
          member: { name: "Test2", email: "test2@example.com" },
        },
      ];

      mockGroupMemberService.findMembersWithDetailsByGroupId.mockResolvedValue(
        members,
      );

      mockBalanceRepository.get.mockImplementation((memberId: number) => {
        if (memberId === 1) return Promise.resolve(100);
        if (memberId === 2) return Promise.resolve(50);
        return Promise.resolve(0);
      });

      const balances = await balanceService.getAllBalancesByGroup(groupId);

      expect(balances).toHaveLength(2);
      expect(balances).toContainEqual({
        name: "Test1",
        email: "test1@example.com",
        currentBalance: 100,
        totalOwedAmount: 20,
        totalYouOweAmount: 10,
        netBalance: 90,
      });
      expect(balances).toContainEqual({
        name: "Test2",
        email: "test2@example.com",
        currentBalance: 50,
        totalOwedAmount: 5,
        totalYouOweAmount: 2,
        netBalance: 47,
      });
    });
  });
});
