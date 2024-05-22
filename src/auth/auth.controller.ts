import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Response,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../common/decorators/public.decorator';
import { Response as Res, Request as Req } from 'express';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Response() res: Res) {
    const { accessToken, refreshToken } =
      await this.authService.signUp(signUpDto);
    return res
      .set({ Authorization: accessToken, 'Refresh-Token': refreshToken })
      .json();
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Response() res: Res) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    return res
      .set({ Authorization: accessToken, 'Refresh-Token': refreshToken })
      .json();
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshTokens(@Request() req: Req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Request() req: Req) {
    this.authService.logout(req.user['sub']);
  }
}
