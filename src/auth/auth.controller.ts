import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/get-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDTO) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @getUser() user: User
  ) {
    return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @getUser() user: User,
    @getUser('email') userEmail: string,
    @RawHeaders() headers: string[],
    //o tambien asi
    @Headers() headersOther: IncomingHttpHeaders
  ) {
    return {
      ok: true,
      msg: user,
      userEmail,
      headers,
      xd: headersOther
    }
  }


  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @getUser() user: User,
  ) {
    return {
      ok: true,
      user
    }
  }
  @Get('private3')
  @Auth()
  privateRoute3(
    @getUser() user: User,
  ) {
    return {
      ok: true,
      user
    }
  }


}
