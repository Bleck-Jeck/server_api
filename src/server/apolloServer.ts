import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ContentResolver } from '../resolvers/ContentResolvers';
import { EpisodeResolver } from '../resolvers/EpisodeResolver';
import http from 'http';
import expressApp from './expressApp';
import {  ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { Request } from 'express';
import { DataSource } from 'typeorm';

/**
 * Запускает Apollo Server.
 * @returns Промис, который разрешается после запуска сервера.
 */
export async function startApolloServer(): Promise<void> {
    // Создаем схему GraphQL на основе резолверов
    const schema = await buildSchema({
        resolvers: [ContentResolver, EpisodeResolver],
        validate: true,
    });

    let server = http.createServer(expressApp);
    

    // Создаем Apollo Server
    const apolloServer = new ApolloServer({
        schema,
        cache: 'bounded',
        context: ({ req }: { req: Request }) => ({
            dataSource: (req as any).dataSource as DataSource,
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        introspection: true,
        persistedQueries: false,
    });

    // Запускаем Apollo Server
    await apolloServer.start();

    // Применяем Apollo Server как промежуточное ПО для Express приложения
    apolloServer.applyMiddleware({
        app: expressApp,
        cors: true,
    });

    // Возвращаем промис, разрешенный после запуска сервера
    await new Promise<void>((resolve) => server.listen({ port: process.env.PORT }, resolve));
    console.log(`🚀 Server ready at  http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
}
