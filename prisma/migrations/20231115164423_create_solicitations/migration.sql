/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `students` table. All the data in the column will be lost.
  - Added the required column `birthdate` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'REFUSED');

-- AlterTable
ALTER TABLE "students" DROP COLUMN "date_of_birth",
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "solicitations" (
    "id" TEXT NOT NULL,
    "complete_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "responsible_name" TEXT,
    "responsible_phone" TEXT,
    "degree_of_kinship" TEXT,
    "note" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitations_pkey" PRIMARY KEY ("id")
);
