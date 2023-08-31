/*
  Warnings:

  - Made the column `cardTypeId` on table `cards` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_cardTypeId_fkey";

-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "cardTypeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_cardTypeId_fkey" FOREIGN KEY ("cardTypeId") REFERENCES "cardtypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
