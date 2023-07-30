-- DropForeignKey
ALTER TABLE "EmailVerificationCode" DROP CONSTRAINT "EmailVerificationCode_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAuthorships" DROP CONSTRAINT "ProjectAuthorships_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAuthorships" DROP CONSTRAINT "ProjectAuthorships_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectPost" DROP CONSTRAINT "ProjectPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectRequest" DROP CONSTRAINT "ProjectRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_socialsId_fkey";

-- AlterTable
ALTER TABLE "ProjectPost" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectPost" ADD CONSTRAINT "ProjectPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationCode" ADD CONSTRAINT "EmailVerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_socialsId_fkey" FOREIGN KEY ("socialsId") REFERENCES "Socials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAuthorships" ADD CONSTRAINT "ProjectAuthorships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAuthorships" ADD CONSTRAINT "ProjectAuthorships_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRequest" ADD CONSTRAINT "ProjectRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
