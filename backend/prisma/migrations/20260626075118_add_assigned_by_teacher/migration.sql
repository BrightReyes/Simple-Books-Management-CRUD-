-- AlterTable
ALTER TABLE "book_assignments" ADD COLUMN     "assigned_by_teacher_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "book_assignments" ADD CONSTRAINT "book_assignments_assigned_by_teacher_id_fkey" FOREIGN KEY ("assigned_by_teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
