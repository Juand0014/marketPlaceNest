import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

	@ApiProperty({ type: String })
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({
    type: String,
    description: 'User password',
    minLength: 6,
    maxLength: 50,
    pattern: '/(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
  })
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
})
	password: string;

	@ApiProperty({
		type: String,
		description: 'User full name',
		minLength: 1,
	})
	@IsString()
	@MinLength(1)
	fullName: string;
}