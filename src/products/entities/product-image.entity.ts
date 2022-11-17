import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from ".";

@Entity({
	name: "product_images"
})
export class ProductImage {

	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: String })
	@Column('text')
	url: string;

	@ApiProperty({ type: () => Product })
	@ManyToOne(
		() => Product,
		product => product.images,
		{ onDelete: 'CASCADE'}
	)
	product: Product;
}