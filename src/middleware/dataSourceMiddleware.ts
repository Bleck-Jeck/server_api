import { Request, Response, NextFunction } from 'express';
import {dataSource} from '../database/database.config';

/**
 * Промежуточное ПО для доступа к источнику данных.
 * @param req Запрос Express.
 * @param res Ответ Express.
 * @param next Функция перехода к следующему промежуточному ПО.
 */
export function dataSourceMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (dataSource.isInitialized) {
        // Если источник данных инициализирован, добавляем его в объект запроса для доступа из других обработчиков маршрутов.
        (req as any).dataSource = dataSource;
        next(); // Переходим к следующему промежуточному ПО.
    } else {
        // Если источник данных не инициализирован, отправляем ошибку 500 с сообщением.
        res.status(500).send('Failed to connect to the database');
    }
}
