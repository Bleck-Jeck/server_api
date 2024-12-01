// src/entities/Studio.ts
import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Content } from './Content';

@ObjectType()
@Entity({ name: "studio" })
export class Studio {
    @Field(() => ID, { description: "Идентификатор студии" })
    @PrimaryGeneratedColumn()
    id: number;

    @Field({ description: "Название студии" })
    @Column({ unique: true, comment: "Название студии" })
    name: string;

    @ManyToMany(() => Content, content => content.studios)
    contents: Content[];
}

