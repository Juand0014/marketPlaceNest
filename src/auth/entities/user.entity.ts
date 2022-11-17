import { Product } from '../../products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {

  @ApiProperty({ type: String, format: 'uuid' , description: 'User id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, description: 'User email', uniqueItems: true })
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    minLength: 6,
    maxLength: 50,
    pattern: '/(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
  })
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'User full name',
    minLength: 1,
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    type: Boolean,
    default: true
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    enum: ['admin', 'user', 'super-user'],
    isArray: true,
    default: ['user'],
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @ApiProperty({
    type: () => [Product],
  })
	@OneToMany(
		()=> Product,
		( Product ) => Product.user
	)
	product: Product;
  
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
