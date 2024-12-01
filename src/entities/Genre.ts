// src/entities/Genre.ts
import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Content } from './Content';

@ObjectType()
@Entity({ name: "genre" })
export class Genre {
    @Field(() => ID, { description: "Идентификатор жанра" })
    @PrimaryGeneratedColumn()
    id: number;

    @Field({ description: "Название жанра" })
    @Column({ unique: true, comment: "Название жанра" })
    name: string;
    
    @Field({ description: "Название жанра" })
    @Column({ unique: true, comment: "en Название жанра" })
    en_name: string;
    
     @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    summary: string;

    @ManyToMany(() => Content, content => content.genres)
    contents: Content[];
}

