import { PrismaClient } from "@prisma/client";

enum ExpenseNames {
  DINNER = "Dinner Expense",
  LUNCH = "Lunch Expense",
  GROCERY = "Grocery Expense",
  RENT = "Rent Expense",
  UTILITY = "Utility Expense",
  INTERNET = "Internet Expense",
  MAINTENANCE = "Maintenance Expense",
}

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.expenseSplit.deleteMany({});
      await transaction.expense.deleteMany({});
      await transaction.balance.deleteMany({});
      await transaction.groupMember.deleteMany({});
      await transaction.member.deleteMany({});
      await transaction.group.deleteMany({});

      await transaction.group.createMany({
        data: [{ name: "Group A" }, { name: "Group B" }],
      });
      const groupA = await transaction.group.findUnique({
        where: { name: "Group A" },
      });
      const groupB = await transaction.group.findUnique({
        where: { name: "Group B" },
      });
      if (!groupA || !groupB) {
        throw new Error("Grupos não encontrados após a criação.");
      }
      await transaction.member.createMany({
        data: [
          { name: "Alice", email: "alice@example.com" },
          { name: "Bob", email: "bob@example.com" },
          { name: "Charlie", email: "charlie@example.com" },
          { name: "David", email: "david@example.com" },
          { name: "Eve", email: "eve@example.com" },
          { name: "Frank", email: "frank@example.com" },
          { name: "Grace", email: "grace@example.com" },
          { name: "Hank", email: "hank@example.com" },
        ],
      });
      const allMembers = await transaction.member.findMany({
        orderBy: { id: "asc" },
      });
      const groupAMembers = allMembers.slice(0, 3);
      const groupBMembers = allMembers.slice(3, 8);
      await transaction.groupMember.createMany({
        data: groupAMembers.map((m) => ({
          groupId: groupA.id,
          memberId: m.id,
        })),
      });
      await transaction.groupMember.createMany({
        data: groupBMembers.map((m) => ({
          groupId: groupB.id,
          memberId: m.id,
        })),
      });
      await transaction.expense.createMany({
        data: [
          {
            groupId: groupA.id,
            name: ExpenseNames.DINNER,
            amount: 300,
            paid: true,
            paymentDate: new Date("2021-09-01T00:00:00.000Z"),
            createdBy: groupAMembers[0].id,
          },
          {
            groupId: groupA.id,
            name: ExpenseNames.LUNCH,
            amount: 120,
            paid: false,
            paymentDate: null,
            createdBy: groupAMembers[1].id,
          },
        ],
      });
      const expensesGroupA = await transaction.expense.findMany({
        where: { groupId: groupA.id },
      });
      await transaction.expenseSplit.createMany({
        data: [
          {
            expenseId: expensesGroupA.find(
              (e) => e.name === ExpenseNames.DINNER,
            )!.id,
            memberId: groupAMembers[1].id,
            splitAmount: 150,
            paid: true,
          },
          {
            expenseId: expensesGroupA.find(
              (e) => e.name === ExpenseNames.DINNER,
            )!.id,
            memberId: groupAMembers[2].id,
            splitAmount: 150,
            paid: true,
          },
          {
            expenseId: expensesGroupA.find(
              (e) => e.name === ExpenseNames.LUNCH,
            )!.id,
            memberId: groupAMembers[0].id,
            splitAmount: 60,
            paid: false,
          },
          {
            expenseId: expensesGroupA.find(
              (e) => e.name === ExpenseNames.LUNCH,
            )!.id,
            memberId: groupAMembers[2].id,
            splitAmount: 60,
            paid: false,
          },
        ],
      });
      await transaction.balance.createMany({
        data: [
          { groupId: groupA.id, memberId: groupAMembers[0].id, balance: 5000 },
          { groupId: groupA.id, memberId: groupAMembers[1].id, balance: 6000 },
          { groupId: groupA.id, memberId: groupAMembers[2].id, balance: 7000 },
        ],
      });
      await transaction.expense.createMany({
        data: [
          {
            groupId: groupB.id,
            name: ExpenseNames.GROCERY,
            amount: 250,
            paid: true,
            paymentDate: new Date("2021-10-01T00:00:00.000Z"),
            createdBy: groupBMembers[0].id,
          },
          {
            groupId: groupB.id,
            name: ExpenseNames.RENT,
            amount: 1500,
            paid: false,
            paymentDate: null,
            createdBy: groupBMembers[1].id,
          },
          {
            groupId: groupB.id,
            name: ExpenseNames.UTILITY,
            amount: 400,
            paid: true,
            paymentDate: new Date("2021-10-05T00:00:00.000Z"),
            createdBy: groupBMembers[2].id,
          },
          {
            groupId: groupB.id,
            name: ExpenseNames.INTERNET,
            amount: 120,
            paid: true,
            paymentDate: new Date("2021-10-10T00:00:00.000Z"),
            createdBy: groupBMembers[3].id,
          },
          {
            groupId: groupB.id,
            name: ExpenseNames.MAINTENANCE,
            amount: 500,
            paid: false,
            paymentDate: null,
            createdBy: groupBMembers[4].id,
          },
        ],
      });
      const expensesGroupB = await transaction.expense.findMany({
        where: { groupId: groupB.id },
      });
      await transaction.expenseSplit.createMany({
        data: [
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.GROCERY,
            )!.id,
            memberId: groupBMembers[1].id,
            splitAmount: 62.5,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.GROCERY,
            )!.id,
            memberId: groupBMembers[2].id,
            splitAmount: 62.5,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.GROCERY,
            )!.id,
            memberId: groupBMembers[3].id,
            splitAmount: 62.5,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.GROCERY,
            )!.id,
            memberId: groupBMembers[4].id,
            splitAmount: 62.5,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find((e) => e.name === ExpenseNames.RENT)!
              .id,
            memberId: groupBMembers[0].id,
            splitAmount: 375,
            paid: false,
          },
          {
            expenseId: expensesGroupB.find((e) => e.name === ExpenseNames.RENT)!
              .id,
            memberId: groupBMembers[2].id,
            splitAmount: 375,
            paid: false,
          },
          {
            expenseId: expensesGroupB.find((e) => e.name === ExpenseNames.RENT)!
              .id,
            memberId: groupBMembers[3].id,
            splitAmount: 375,
            paid: false,
          },
          {
            expenseId: expensesGroupB.find((e) => e.name === ExpenseNames.RENT)!
              .id,
            memberId: groupBMembers[4].id,
            splitAmount: 375,
            paid: false,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.UTILITY,
            )!.id,
            memberId: groupBMembers[0].id,
            splitAmount: 100,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.UTILITY,
            )!.id,
            memberId: groupBMembers[1].id,
            splitAmount: 100,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.UTILITY,
            )!.id,
            memberId: groupBMembers[3].id,
            splitAmount: 100,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.UTILITY,
            )!.id,
            memberId: groupBMembers[4].id,
            splitAmount: 100,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.INTERNET,
            )!.id,
            memberId: groupBMembers[0].id,
            splitAmount: 30,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.INTERNET,
            )!.id,
            memberId: groupBMembers[1].id,
            splitAmount: 30,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.INTERNET,
            )!.id,
            memberId: groupBMembers[2].id,
            splitAmount: 30,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.INTERNET,
            )!.id,
            memberId: groupBMembers[4].id,
            splitAmount: 30,
            paid: true,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.MAINTENANCE,
            )!.id,
            memberId: groupBMembers[0].id,
            splitAmount: 125,
            paid: false,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.MAINTENANCE,
            )!.id,
            memberId: groupBMembers[1].id,
            splitAmount: 125,
            paid: false,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.MAINTENANCE,
            )!.id,
            memberId: groupBMembers[2].id,
            splitAmount: 125,
            paid: false,
          },
          {
            expenseId: expensesGroupB.find(
              (e) => e.name === ExpenseNames.MAINTENANCE,
            )!.id,
            memberId: groupBMembers[3].id,
            splitAmount: 125,
            paid: false,
          },
        ],
      });
      await transaction.balance.createMany({
        data: [
          { groupId: groupB.id, memberId: groupBMembers[0].id, balance: 10000 },
          { groupId: groupB.id, memberId: groupBMembers[1].id, balance: 11000 },
          { groupId: groupB.id, memberId: groupBMembers[2].id, balance: 9000 },
          { groupId: groupB.id, memberId: groupBMembers[3].id, balance: 15000 },
          { groupId: groupB.id, memberId: groupBMembers[4].id, balance: 20000 },
        ],
      });
      console.log("Seeder executed successfully!");
    });
  } catch (error) {
    console.error("Error running seeder:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
