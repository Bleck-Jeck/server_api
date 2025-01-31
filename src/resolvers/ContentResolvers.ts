import { Query, Resolver, Arg, Int } from "type-graphql";
import { Content, ContentType,ReleaseStatus } from "../entities/Content";
import { Genre } from "../entities/Genre";
import { Repository, Like,Between, MoreThanOrEqual } from "typeorm";
import { dataSource } from "../database/database.config";

@Resolver()
export class ContentResolver {
    private readonly contentRepository: Repository<Content>;
    private readonly genreRepository: Repository<Genre>;

    constructor() {
        this.contentRepository = dataSource.getRepository(Content);
        this.genreRepository = dataSource.getRepository(Genre);
    }

    // 1. Получить все жанры
    @Query(() => [Genre])
    async genres(): Promise<Genre[]> {
        return await this.genreRepository.find();
    }


    // 2. Получить все фильмы с фильтрацией и пагинацией
    @Query(() => [Content])
    async getAllMovies(
        @Arg("page", () => Int, { nullable: true, defaultValue: 1 }) page: number,
        @Arg("limit", () => Int, { nullable: true, defaultValue: 10 }) limit: number,
        @Arg("rating", () => Int, { nullable: true }) rating?: number // Rating остается числом
    ): Promise<Content[]> {
        // Валидация limit
        const MAX_LIMIT = 100;
        const validatedLimit = Math.min(Math.max(limit, 1), MAX_LIMIT); // Ограничиваем limit

        // Расчет смещения для пагинации (skip)
        const offset = (page - 1) * validatedLimit; // Смещение = (страница - 1) * limit

        const where: any = { content_type: ContentType.MOVIE };

        // Добавляем фильтрацию по рейтингу, если он передан
        if (rating) {
            where.rating = MoreThanOrEqual(rating);
        }

        return await this.contentRepository.find({
            where,
            relations: ["genres", "studios", "contentIds", "episodes"],
            take: validatedLimit,  // Ограничиваем количество записей
            skip: offset, // Пропуск записей для пагинации
            order: { release_date: "DESC" },
        });
    }
    

    

    // Фильтрация контента по году, рейтингу, типу, дате выхода и статусу
    @Query(() => [Content])
    async getFilteredContent(
        @Arg("year", () => Int, { nullable: true }) year?: number,
        @Arg("rating", () => Int, { nullable: true }) rating?: number,
        @Arg("contentType", () => ContentType, { nullable: true }) contentType?: ContentType,
        @Arg("releaseDateStart", () => Int, { nullable: true }) releaseDateStart?: number,
        @Arg("releaseDateEnd", () => Int, { nullable: true }) releaseDateEnd?: number,
        @Arg("releaseStatus", () => ReleaseStatus, { nullable: true }) releaseStatus?: ReleaseStatus,
        @Arg("page", () => Int, { nullable: true, defaultValue: 1 }) page: number = 1,
        @Arg("limit", () => Int, { nullable: true, defaultValue: 10 }) limit: number = 10
    ): Promise<Content[]> {
        const MAX_LIMIT = 100;
        const validatedLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
        const offset = (page - 1) * validatedLimit;

        const where: any = {};

        // Фильтрация по году
        if (year) {
            where.year = year;
        }

        // Фильтрация по рейтингу
        if (rating) {
            where.rating = MoreThanOrEqual(rating);
        }

        // Фильтрация по типу контента
        if (contentType) {
            where.content_type = contentType;
        }

        // Фильтрация по дате выхода (диапазон)
        if (releaseDateStart && releaseDateEnd) {
            where.release_date = Between(releaseDateStart, releaseDateEnd);
        } else if (releaseDateStart) {
            where.release_date = MoreThanOrEqual(releaseDateStart);
        }

        // Фильтрация по статусу релиза
        if (releaseStatus) {
            where.release_status = releaseStatus;
        }

        return await this.contentRepository.find({
            where,
            relations: ["genres", "studios", "contentIds", "episodes"],
            take: validatedLimit,
            skip: offset,
            order: { release_date: "DESC" },
        });
    }


    // 3. Получить контент по ID
    @Query(() => Content, { nullable: true })
    async getContentById(@Arg("id", () => Int) id: number): Promise<Content | null> {
        return await this.contentRepository.findOne({
            where: { content_id: id },
            relations: ["genres", "studios", "contentIds", "episodes"],
        });
    }

    // 4. Получить контент с фильтрацией по типу и рейтингу
    @Query(() => [Content])
    async getContentByType(
        @Arg("contentType", () => ContentType) contentType: ContentType,
        @Arg("page", () => Int, { nullable: true, defaultValue: 1 }) page: number,
        @Arg("limit", () => Int, { nullable: true, defaultValue: 10 }) limit: number,
        @Arg("rating", () => Int, { nullable: true }) rating?: number
    ): Promise<Content[]> {
        // Валидация limit
        const MAX_LIMIT = 100;
        const validatedLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);

        // Расчет смещения для пагинации
        const offset = (page - 1) * validatedLimit;

        const where: any = { content_type: contentType };

        // Фильтрация по рейтингу
        if (rating) {
            where.rating = MoreThanOrEqual(rating);
        }

        return await this.contentRepository.find({
            where,
            relations: ["genres", "studios", "contentIds", "episodes"],
            take: validatedLimit,
            skip: offset,
            order: { release_date: "DESC" },
        });
    }

    // 5. Получить последние обновленные записи с опциональной фильтрацией
    @Query(() => [Content])
    async getRecentlyUpdatedContent(
        @Arg("page", () => Int, { nullable: true, defaultValue: 1 }) page: number,
        @Arg("limit", () => Int, { nullable: true, defaultValue: 10 }) limit: number,
        @Arg("contentType", () => ContentType, { nullable: true }) contentType?: ContentType
    ): Promise<Content[]> {
        const MAX_LIMIT = 100;
        const validatedLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
        const offset = (page - 1) * validatedLimit;

        const where: any = contentType ? { content_type: contentType } : {};

        return await this.contentRepository.find({
            where,
            order: { updated_at: "DESC" },
            take: validatedLimit,
            skip: offset,
            relations: ["genres", "studios", "contentIds", "episodes"],
        });
    }

	    // 6. Поиск контента по названию
	@Query(() => [Content])
	async searchContent(
	    @Arg("query") query: string,
	    @Arg("page", () => Int, { nullable: true, defaultValue: 1 }) page: number,
	    @Arg("limit", () => Int, { nullable: true, defaultValue: 10 }) limit: number
	): Promise<Content[]> {
	    const MAX_LIMIT = 100;
	    const validatedLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
	    const offset = (page - 1) * validatedLimit;

	    return await this.contentRepository.find({
		where: [
		    { title: Like(`%${query}%`) },
		    { original_title: Like(`%${query}%`) }
		],
		take: validatedLimit,
		skip: offset,
		relations: ["genres", "studios", "contentIds", "episodes"],
	    });
	}


    // 7. Получить количество контента по типу
    @Query(() => Int)
    async getContentCountByType(@Arg("contentType", () => ContentType) contentType: ContentType): Promise<number> {
        return await this.contentRepository.count({ where: { content_type: contentType } });
    }
    
    // 8. Получить список всех доступных ID контента
	@Query(() => [Int])
	async getAllContentIds(): Promise<number[]> {
	    const contentIds = await this.contentRepository.find({
		select: ["content_id"], // Выбираем только поле content_id
	    });
	    return contentIds.map((content) => content.content_id); // Возвращаем массив ID
	}

}

