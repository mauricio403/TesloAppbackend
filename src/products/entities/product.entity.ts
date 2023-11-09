import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example:'1ab2c64f-a0a4-4cad-8b81-7f4a24a3e965',
        description:'product id',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'T-Shirt',
        description:'product title',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({
        example:0,
        description:'product price',
    })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({
        example:'Aliquip magna occaecat aute elit id nostrud do irure laborum laboris.',
        description:'product description',
        default: null
    })
    @Column('text', { nullable: true })
    description: string;

    
    @Column('text', { unique: true })
    slug: string

    @Column('int', { default: 0 })
    stock: number;

    @Column('text', { array: true })
    sizes: string[]

    @Column('text')
    gender: string;

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager:true}
    )
    user: User



    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

}
