-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balance_memberId_groupId_key" ON "Balance"("memberId", "groupId");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
