-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secretWord" VARCHAR(255),
ALTER COLUMN "updated_at" DROP DEFAULT;
