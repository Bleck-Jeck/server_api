import { Query, Resolver, Arg, Int } from "type-graphql";
import { Content, ReleaseStatus, ContentType } from "../entities/Content";
import { Repository, Not, IsNull, Between } from "typeorm";
import { dataSource } from "../database/database.config";

@Resolver()
export class EpisodeResolver {
    private readonly contentRepository: Repository<Content>;

    constructor() {
        this.contentRepository = dataSource.getRepository(Content);
    }

    @Query(() => [Content])
    async getContentWithNextEpisode(
        @Arg("sortByDate", { nullable: true, defaultValue: "DESC" }) sortByDate: "ASC" | "DESC",
        @Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
        @Arg("offset", () => Int, { defaultValue: 0 }) offset: number,
        @Arg("contentType", () => ContentType, { nullable: true }) contentType?: ContentType,
    ): Promise<Array<Partial<Content>>> {
        const MAX_LIMIT = 100;
        const validatedLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
        const validatedOffset = Math.max(offset, 0);

        // Создаем фильтр для контента
        const where: any = {
            release_status: ReleaseStatus.IN_PRODUCTION, // Статус ongoing
            next_episode: Not(IsNull()), // next_episode не должно быть пустым
        };

        if (contentType) {
            where.content_type = contentType;
        }

        // Получаем данные с нужными условиями
        const contents = await this.contentRepository.find({
            where: where,
            relations: ["genres", "studios", "contentIds", "episodes"],
            take: validatedLimit,
            skip: validatedOffset,
            order: { next_episode: sortByDate === "ASC" ? "ASC" : "DESC" },
        });

        // Возвращаем данные без преобразования UNIX-времени в ISO
        return contents.map((content) => {
            return {
                ...content,
                next_episode: content.next_episode, // возвращаем UNIX-время без изменений
            };
        }) as Partial<Content>[];
    }

@Query(() => [Content])
async getWeeklySchedule(
    @Arg("timezoneOffset", () => Int, { nullable: true, defaultValue: 0 }) timezoneOffset: number,
): Promise<Array<Partial<Content>>> {
    const now = new Date();
    const startOfToday = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000); // В секундах
    const endOfWeek = startOfToday + 7 * 24 * 60 * 60; // Конец недели

    // Фильтрация контента по дате
    const contents = await this.contentRepository.find({
        where: {
            release_status: ReleaseStatus.IN_PRODUCTION, // Только в производстве
            next_episode: Between(startOfToday, endOfWeek), // Попадает в текущую неделю
        },
        relations: ["genres", "studios", "contentIds", "episodes"],
        order: { next_episode: "ASC" },
    });

    // Добавляем обработку таймзоны и проверку
    return contents.map((content) => {
        let nextEpisodeTime = content.next_episode;

        if (nextEpisodeTime && nextEpisodeTime > 1000000000000) {
            // Если значение в миллисекундах, преобразуем в секунды
            nextEpisodeTime = Math.floor(nextEpisodeTime / 1000);
        }

        // Применяем смещение таймзоны
        if (nextEpisodeTime) {
            nextEpisodeTime += timezoneOffset * 60 * 60; // Сдвиг в секундах
        }

        return {
            ...content,
            next_episode: nextEpisodeTime, // Возвращаем скорректированное время
        };
    }) as Partial<Content>[];
}

@Query(() => [Content])
async getScheduledContent(
    @Arg("sortByDate", { nullable: true, defaultValue: "DESC" }) sortByDate: "ASC" | "DESC",
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
    @Arg("offset", () => Int, { defaultValue: 0 }) offset: number,
    @Arg("contentType", () => ContentType, { nullable: true }) contentType?: ContentType,
    @Arg("weekly", { nullable: true, defaultValue: false }) weekly?: boolean,
    @Arg("timezoneOffset", () => Int, { nullable: true, defaultValue: 0 }) timezoneOffset: number = 0,
): Promise<Array<Partial<Content>>> {
    const MAX_LIMIT = 100;
    const validatedLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
    const validatedOffset = Math.max(offset, 0);

    // Создаем базовый фильтр
    const where: any = {
        release_status: ReleaseStatus.IN_PRODUCTION,
        next_episode: Not(IsNull()),
    };

    // Если требуется расписание на неделю
    if (weekly) {
        const now = new Date();
        const startOfToday = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000); // В секундах
        const endOfWeek = startOfToday + 7 * 24 * 60 * 60; // Конец недели
        where.next_episode = Between(startOfToday, endOfWeek);
    }

    if (contentType) {
        where.content_type = contentType;
    }

    // Запрашиваем данные с фильтрами и условиями
    const contents = await this.contentRepository.find({
        where: where,
        relations: ["genres", "studios", "contentIds", "episodes"],
        take: validatedLimit,
        skip: validatedOffset,
        order: { next_episode: sortByDate === "ASC" ? "ASC" : "DESC" },
    });

    // Применяем корректировку таймзоны
    return contents.map((content) => {
        let nextEpisodeTime = content.next_episode;

        if (nextEpisodeTime && nextEpisodeTime > 1000000000000) {
            // Если время в миллисекундах, преобразуем в секунды
            nextEpisodeTime = Math.floor(nextEpisodeTime / 1000);
        }

        if (nextEpisodeTime) {
            nextEpisodeTime += timezoneOffset * 60 * 60; // Применяем смещение таймзоны
        }

        return {
            ...content,
            next_episode: nextEpisodeTime,
        };
    }) as Partial<Content>[];
}


}

