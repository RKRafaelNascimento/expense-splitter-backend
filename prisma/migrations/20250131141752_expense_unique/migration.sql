/*
  Warnings:

  - A unique constraint covering the columns `[id,groupId]` on the table `Expense` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Expense_id_groupId_key" ON "Expense"("id", "groupId");
