-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "open_now" BOOLEAN,
ADD COLUMN     "reviews" JSONB DEFAULT '[]',
ADD COLUMN     "total_ratings" INTEGER;

-- CreateTable
CREATE TABLE "search_cache" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "results" JSONB NOT NULL DEFAULT '[]',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_cache" (
    "id" TEXT NOT NULL,
    "photo_reference" TEXT NOT NULL,
    "image_data" BYTEA NOT NULL,
    "content_type" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photo_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "search_cache_query_key" ON "search_cache"("query");

-- CreateIndex
CREATE INDEX "search_cache_expires_at_idx" ON "search_cache"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "photo_cache_photo_reference_key" ON "photo_cache"("photo_reference");

-- CreateIndex
CREATE INDEX "photo_cache_expires_at_idx" ON "photo_cache"("expires_at");
