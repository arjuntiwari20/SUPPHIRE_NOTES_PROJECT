-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "approvalCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requiredApprovals" INTEGER;

-- CreateTable
CREATE TABLE "NoteApproval" (
    "id" SERIAL NOT NULL,
    "NoteId" INTEGER NOT NULL,
    "approvedById" INTEGER NOT NULL,

    CONSTRAINT "NoteApproval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NoteApproval_NoteId_approvedById_key" ON "NoteApproval"("NoteId", "approvedById");

-- AddForeignKey
ALTER TABLE "NoteApproval" ADD CONSTRAINT "NoteApproval_NoteId_fkey" FOREIGN KEY ("NoteId") REFERENCES "Note"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteApproval" ADD CONSTRAINT "NoteApproval_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
