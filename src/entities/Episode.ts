import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Content } from "./Content"; // Предполагается, что у вас есть файл Content.ts

@ObjectType()
@Entity({ name: "episode" })
export class Episode {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    episode_id: number;

    @Field(() => Int)
    @Column()
    season_id: number; // Foreign key на content_id сезона

    @Field(() => Int)
    @Column()
    episode_number: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    title: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: "text" })
    summary: string;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    duration: number;

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true })
    release_date: Date;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    release_time: string; // Хранение времени в формате 'HH:MM'

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    release_status: string; // Статус релиза

    @Field({ nullable: true })
    @Column({ nullable: true })
    player_url: string; // URL на плеер
    
    @Field(() => Content, { description: "Контент (сезон), к которому относится эпизод" })
    @ManyToOne(() => Content, content => content.episodes)
    content: Content;
}


