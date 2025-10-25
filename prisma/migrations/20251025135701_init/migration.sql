-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hash" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "txHash" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "qrCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "certificates_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "ethereumAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_hash_key" ON "documents"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "documents_txHash_key" ON "documents"("txHash");

-- CreateIndex
CREATE INDEX "documents_hash_idx" ON "documents"("hash");

-- CreateIndex
CREATE INDEX "documents_txHash_idx" ON "documents"("txHash");

-- CreateIndex
CREATE INDEX "documents_author_idx" ON "documents"("author");

-- CreateIndex
CREATE INDEX "certificates_documentId_idx" ON "certificates"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_ethereumAddress_key" ON "users"("ethereumAddress");

-- CreateIndex
CREATE INDEX "users_ethereumAddress_idx" ON "users"("ethereumAddress");
