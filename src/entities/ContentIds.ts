import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Content } from "./Content"; // Убедитесь, что путь правильный

@ObjectType()
@Entity({ name: "content_ids" }) // Обратите внимание на имя таблицы, чтобы оно совпадало с тем, что в базе данных
@Index("unique_external_id_per_type", ["externalId", "idType"], { unique: true })
export class ContentIds {
    @Field(() => Int)
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Field(() => Int)
    @Column({ name: "content_id" })
    contentId: number;

    @Field(() => String)
    @Column({ name: "id_type" })
    idType: string;

    @Field(() => String)
    @Column({ name: "external_id" })
    externalId: string;

    @Field(() => Content)
    @ManyToOne(() => Content, content => content.contentIds, { onDelete: "CASCADE" })
    @JoinColumn({ name: "content_id", referencedColumnName: "content_id" })
    content: Content;
}

