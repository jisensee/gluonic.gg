-- CreateTable
CREATE TABLE "ProjectRequest" (
    "id" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectAbstract" TEXT NOT NULL,
    "projectWebsite" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "ProjectRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectRequest" ADD CONSTRAINT "ProjectRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRequest" ADD CONSTRAINT "ProjectRequest_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
