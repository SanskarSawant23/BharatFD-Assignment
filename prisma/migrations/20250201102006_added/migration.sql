/*
  Warnings:

  - You are about to drop the column `question_bengali` on the `FAQ` table. All the data in the column will be lost.
  - You are about to drop the column `question_hindi` on the `FAQ` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FAQ" DROP COLUMN "question_bengali",
DROP COLUMN "question_hindi",
ADD COLUMN     "answer_bn" TEXT,
ADD COLUMN     "answer_hi" TEXT,
ADD COLUMN     "question_bn" TEXT,
ADD COLUMN     "question_hi" TEXT;
