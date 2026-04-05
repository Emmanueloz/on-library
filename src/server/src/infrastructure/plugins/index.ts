import fp from "fastify-plugin";
import { SeriesService } from "../../application/features/series/series-service.ts";
import type { ISeriesRepo } from "../../application/features/series/series-repo.ts";
import { SeriesDao } from "../dao/series-dao.ts";
import type { FastifyInstance } from "fastify/types/instance.js";
import { TagsServices } from "../../application/features/tags/tags-services.ts";
import type { ITagsRepo } from "../../application/features/tags/tags-repo.ts";
import { TagsDao } from "../dao/tags-dao.ts";
import { CategoriesServices } from "../../application/features/categories/categories-services.ts";
import { CategoriesDao } from "../dao/categories-dao.ts";
import { ChaptersDao } from "../dao/chapters-dao.ts";
import { ChaptersService } from "../../application/features/chapters/chapters-service.ts";
import { PagesDao } from "../dao/pages-dao.ts";
import { PagesService } from "../../application/features/pages/pages-service.ts";
import { FilesystemImageStorage } from "../services/filesystem-image-storage.ts";
import { MEDIA_DIR } from "../constants/index.ts";

declare module "fastify" {
  interface FastifyInstance {
    seriesService: SeriesService;
    tagsService: TagsServices;
    categoriesService: CategoriesServices;
    chaptersService: ChaptersService;
    pagesService: PagesService;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const seriesRepo: ISeriesRepo = new SeriesDao(fastify.prisma);
  const tagsRepo: ITagsRepo = new TagsDao(fastify.prisma);

  const seriesService = new SeriesService(seriesRepo);
  const tagsService = new TagsServices(tagsRepo);

  const categoriesRepo = new CategoriesDao(fastify.prisma);
  const categoriesService = new CategoriesServices(categoriesRepo);

  const chaptersRepo = new ChaptersDao(fastify.prisma);
  const chaptersService = new ChaptersService(chaptersRepo);

  const imageStorage = new FilesystemImageStorage(MEDIA_DIR);
  const pagesRepo = new PagesDao(fastify.prisma);
  const pagesService = new PagesService(pagesRepo, imageStorage);

  fastify.decorate("seriesService", seriesService);
  fastify.decorate("tagsService", tagsService);
  fastify.decorate("categoriesService", categoriesService);
  fastify.decorate("chaptersService", chaptersService);
  fastify.decorate("pagesService", pagesService);
});
