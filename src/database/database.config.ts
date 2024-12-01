// database.config.ts
import "reflect-metadata";

import { DataSource } from 'typeorm';
import { Content } from '../entities/Content';
import { Genre } from '../entities/Genre';
import { Studio } from '../entities/Studio';
import { Episode } from '../entities/Episode';
import { ContentIds } from '../entities/ContentIds';

import { config } from "dotenv-safe";

config({
    allowEmptyValues: true,
});

// import * as path from "path"; 

 const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Content, Genre, Episode, ContentIds, Studio], // Укажите все ваши сущности здесь
    migrations: ["../migrations/*.ts"],
    synchronize: true,// Автоматическое создание таблиц приложения в базе данных (в разработке это удобно, но не рекомендуется в продакшене)
    logging: true, // Логгирование SQL-запросов (включено для отладки)
    
});



export {dataSource}
