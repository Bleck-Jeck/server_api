import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { dataSourceMiddleware } from '../middleware/dataSourceMiddleware';

const app: Application = express();

// Используем CORS middleware для обработки CORS запросов
app.use(cors());

// Парсим JSON тело запроса
app.use(express.json());

// Устанавливаем заголовки CORS вручную
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Подключаем промежуточное ПО для работы с dataSource
app.use(dataSourceMiddleware);

// Устанавливаем флаг trust proxy для доверия прокси
app.set("trust proxy", 1);

// Обработчик маршрута для проверки статуса сервера
app.get('/status', (_: Request, res: Response) => {
    res.send('Server is running');
});

export default app;
