/*
  Warnings:

  - You are about to drop the column `user_id` on the `responsibles` table. All the data in the column will be lost.
  - Added the required column `student_id` to the `responsibles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "responsibles" DROP CONSTRAINT "responsibles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_user_id_fkey";

-- AlterTable
ALTER TABLE "responsibles" DROP COLUMN "user_id",
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsibles" ADD CONSTRAINT "responsibles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
