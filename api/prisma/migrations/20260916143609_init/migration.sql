-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'LOW',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "responsibleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Ticket_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "Responsible" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Responsible" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsible_name_key" ON "Responsible"("name");
