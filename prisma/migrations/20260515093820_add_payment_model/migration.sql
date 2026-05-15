/*
  Warnings:

  - You are about to drop the column `bankReference` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `idempotencyKey` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `retryCount` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `cardToken` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_idempotencyKey_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "bankReference",
DROP COLUMN "currency",
DROP COLUMN "idempotencyKey",
DROP COLUMN "retryCount",
ADD COLUMN     "cardToken" TEXT NOT NULL;
