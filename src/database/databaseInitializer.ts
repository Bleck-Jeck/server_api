import {dataSource} from './database.config';

/**
 * Инициализирует базу данных.
 * @throws Error если инициализация базы данных не удалась.
 */
export async function initializeDatabase(): Promise<void> {
    try {
        await dataSource.initialize();
        await dataSource.runMigrations()
        console.log('🌟 База данных успешно подключена! Йоу!');
    } catch (error) {
        console.error('💥 Ошибка при инициализации базы данных:', error);
        throw new Error('Не удалось инициализировать базу данных');
    }
}

