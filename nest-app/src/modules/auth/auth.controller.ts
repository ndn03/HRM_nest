import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Auth, AuthUser } from '@common/decorators/auth.decorator';
import { Public } from '@common/decorators/auth.decorator';
import { RegisterDto } from './dto/register.dto';
import { User } from '@entities/user.entity';
import { UserService } from '../user/user.service';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logs into the system' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validUserBeforeLogin(
      body.username,
      body.password,
    );
    const auth = this.authService.createToken(user);
    return { message: 'general.success', data: auth };
  }

  @Post('refresh-token')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  async refreshToken(@AuthUser() user: User) {
    const auth = this.authService.createToken(user);
    return { message: 'general.success', data: auth };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register as a system user' })
  async register(@Body() body: RegisterDto) {
    await this.userService.register(body);
    return { message: 'general.success' };
  }

  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logs out of the system' })
  async logout() {
    // TODO: ...
    return { message: 'general.success' };
  }
}
