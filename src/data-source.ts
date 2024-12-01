import "reflect-metadata"
import { DataSource } from 'typeorm';
import { Content } from './entities/Content';
import { Genre } from './entities/Genre';
import { Episode } from './entities/Episode';
import { ContentIds } from './entities/ContentIds';



export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "root",
    database: "anifid",
    synchronize: true,
    logging: false,
    entities: [Content, Genre, Episode, ContentIds],
    migrations: ["../dist/migrations/*.ts"],
    subscribers: ["../dist/subscribers/*.ts"],
})
