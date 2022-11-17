import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags, getSchemaPath, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth, GetUser, RowHeaders } from './decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorator/role-protected.decorator';
import { ValidRoles } from './interfaces';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'user was created', type: CreateUserDto})
  @ApiResponse({ status: 400, description: 'Bad request'})
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'user was logged in', type: LoginUserDto})
  @ApiResponse({ status: 400, description: 'Bad request'})
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiBearerAuth()
  @Auth()
  @ApiResponse({ status: 200, description: 'TokenUpdated', schema: { 
    type: 'object',
    properties: {
      user: {
        $ref: getSchemaPath(LoginUserDto)
      },
      token: {
        type: 'string',
        format: 'jwt',
      }
    }
  }})
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related'})
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related'})
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  @ApiBearerAuth()
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RowHeaders() rowHeaders: string[],
  ){
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rowHeaders
    }
  }

  @Get('private2')
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard )
  @ApiBearerAuth()
  privateRouter2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth( ValidRoles.admin )
  @ApiBearerAuth()
  privateRouter3(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }
}
