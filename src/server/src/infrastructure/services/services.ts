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

declare module "fastify" {
  interface FastifyInstance {
    seriesService: SeriesService;
    tagsServices: TagsServices;
    categoriesService: CategoriesServices;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const seriesRepo: ISeriesRepo = new SeriesDao(fastify.prisma);
  const tagsRepo: ITagsRepo = new TagsDao(fastify.prisma);

  const seriesService = new SeriesService(seriesRepo);
  const tagsService = new TagsServices(tagsRepo);

  const categoriesRepo = new CategoriesDao(fastify.prisma);
  const categoriesService = new CategoriesServices(categoriesRepo);

  fastify.decorate("seriesService", seriesService);
  fastify.decorate("tagsServices", tagsService);
  fastify.decorate("categoriesService", categoriesService);
});
