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
import { LibrariesService } from "../../application/features/libraries/libraries-service.ts";
import type { ILibrariesRepo } from "../../application/features/libraries/libraries-repo.ts";
import { LibrariesDao } from "../dao/libraries-dao.ts";
import { AuthService } from "../../application/features/auth/auth-service.ts";
import type { IAuthRepo } from "../../application/features/auth/auth-repo.ts";
import { AuthDao } from "../dao/auth-dao.ts";
import { UsersService } from "../../application/features/users/users-service.ts";
import type { IUsersRepo } from "../../application/features/users/users-repo.ts";
import { UsersDao } from "../dao/users-dao.ts";
import { JwtService } from "../security/JwtService.ts";
import { BcryptService } from "../security/bcryptService.ts";

declare module "fastify" {
  interface FastifyInstance {
    seriesService: SeriesService;
    tagsService: TagsServices;
    categoriesService: CategoriesServices;
    chaptersService: ChaptersService;
    pagesService: PagesService;
    librariesService: LibrariesService;
    authService: AuthService;
    usersService: UsersService;
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

  const librariesRepo: ILibrariesRepo = new LibrariesDao(fastify.prisma);
  const librariesService = new LibrariesService(librariesRepo);

  const authRepo: IAuthRepo = new AuthDao(fastify.prisma);
  const tokenService = new JwtService(fastify);
  const encryptService = new BcryptService();
  const authService = new AuthService(authRepo, tokenService, encryptService);

  const usersRepo: IUsersRepo = new UsersDao(fastify.prisma);
  const usersService = new UsersService(usersRepo, encryptService);

  fastify.decorate("seriesService", seriesService);
  fastify.decorate("tagsService", tagsService);
  fastify.decorate("categoriesService", categoriesService);
  fastify.decorate("chaptersService", chaptersService);
  fastify.decorate("pagesService", pagesService);
  fastify.decorate("librariesService", librariesService);
  fastify.decorate("authService", authService);
  fastify.decorate("usersService", usersService);
});
