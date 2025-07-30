-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "bookmarkcount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "NoteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_UserId_NoteId_key" ON "Bookmark"("UserId", "NoteId");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_NoteId_fkey" FOREIGN KEY ("NoteId") REFERENCES "Note"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
