// index.ts
import "reflect-metadata";
import { config } from "dotenv-safe";
import expressApp from './server/expressApp';
import { startApolloServer } from './server/apolloServer';
import { initializeDatabase } from './database/databaseInitializer';
import { dataSourceMiddleware } from './middleware/dataSourceMiddleware';

// Загрузка конфигурации из файла .env
config({ allowEmptyValues: true });

// Инициализация базы данных и запуск сервера
initializeDatabase()
  .then(() => {
    // Добавление middleware для доступа к dataSource
    expressApp.use(dataSourceMiddleware);

    // Запуск Apollo Server
    startApolloServer();
  })
  .catch((error) => {
    console.error('Ошибка при инициализации базы данных:', error);
    console.error('Что-то пошло не так. Пожалуйста, проверьте конфигурацию и настройки вашего приложения.');
  });
