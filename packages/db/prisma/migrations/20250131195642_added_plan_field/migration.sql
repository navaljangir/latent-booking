-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('start', 'basic', 'standard', 'premium');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "PlanType" NOT NULL DEFAULT 'start';
