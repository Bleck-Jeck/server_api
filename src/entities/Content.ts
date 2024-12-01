import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, Int, Float } from "type-graphql";
import { Episode } from "./Episode"; // Предполагается, что у вас есть файл Episode.ts
import { Genre } from './Genre';
import { Studio } from './Studio';
import { ContentIds } from './ContentIds';
import { registerEnumType } from "type-graphql";
// import { ContentGenre } from "./ContentGenre"; // Предполагается, что у вас есть файл ContentGenre.tsContentIds

export enum ContentType {
    MOVIE = "movie",
    SERIES = "series",
    ONA = "ona",
    OVA = "ova",
    SPECIAL = "special",
    SERIES_SPECIAL = "series_special",
}

export enum ReleaseStatus {
    ANNOUNCED = "announced",
    IN_PRODUCTION = "ongoing",
    RELEASED = "released",
    POSTPONED = "postponed",
    CANCELED = "canceled",
}

registerEnumType(ReleaseStatus, {
    name: "ReleaseStatus", // Это имя будет использоваться в GraphQL-схеме
    description: "The release status of the content", // Опционально: описание для документации
});
registerEnumType(ContentType, {
    name: "ContentType", // Имя, под которым перечисление будет доступно в GraphQL-схеме
    description: "The type of content (e.g., movie, series)", // Описание для документации
});

@ObjectType()
@Entity({ name: "content" })
export class Content {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    content_id: number;

    @Field()
    @Column({ unique: true })
    title: string;

    @Field()
    @Column({ unique: true })
    original_title: string;

    @Field(() => Int, { nullable: true }) // UNIX-время в секундах
    @Column({ type: "bigint", nullable: true })
    release_date: number | null;
    
    @Field(() => String, { nullable: true }) // UNIX-время в секундах
    @Column({ type: "bigint", nullable: true })
    next_episode: number | null ;
    
    @Field(() => Int, { nullable: true })
    @Column({ nullable: true})
    year: number;
    
    @Field(() => String)
    @Column({ type: "varchar", length: 20 })
    release_status: ReleaseStatus;

    @Field(() => String)
    @Column({
        type: "enum",
        enum: ContentType,
    })
    content_type: ContentType;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    season_number: number;

    @Field(() => Int)
    @Column()
    age_rating: number;

    @Field({ nullable: true })
    @Column({ nullable: true, length: 20 })
    mpaa_rating: string;

    @Field(() => Float, { nullable: true })
    @Column({ type: "float", nullable: true })
    rating: number;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    summary: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    poster_url: string;
    
    @Field({ nullable: true })
    @Column({ nullable: true })
    img: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    trailer_url: string;

    @Field()
    @Column()
    country: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    player_url: string;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    series_id: number; // Foreign key для ссылок на основной сериал
    
    @Field(() => Date)
    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Field(() => [Genre], { description: "Genre, связанные с контентом" })
    @ManyToMany(() => Genre, genre => genre.contents)
    @JoinTable() // Это указывает, что эта таблица будет являться связующей
    genres: Genre[];
    
    @Field(() => [Studio], { description: "Studio, связанные с контентом" })
    @ManyToMany(() => Studio, studio => studio.contents)
    @JoinTable() // Это указывает, что эта таблица будет являться связующей
    studios: Studio[];

    @Field(() => [Episode], { description: "Эпизоды, связанные с контентом" })
    @OneToMany(() => Episode, episode => episode.content)
    episodes: Episode[];
    
    @Field(() => [ContentIds])
    @OneToMany(() => ContentIds, contentIds => contentIds.content)
    contentIds: ContentIds[];
}

