-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "approvedById" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
