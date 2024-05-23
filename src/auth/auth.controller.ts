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
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../common/decorators/public.decorator';
import { Response as Res, Request as Req } from 'express';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { JoiValidationPipe } from '../common/pipes/validation.pipe';
import { signInSchema, signUpSchema } from '../user/dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: 200,
    description: 'Sign up',
    headers: {
      Authorization: { required: true },
      'Refresh-Token': { required: true },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(signUpSchema))
  async signUp(@Body() signUpDto: SignUpDto, @Response() res: Res) {
    const { accessToken, refreshToken } =
      await this.authService.signUp(signUpDto);
    return res
      .set({ Authorization: accessToken, 'Refresh-Token': refreshToken })
      .json();
  }

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({
    status: 200,
    description: 'Sign in',
    headers: {
      Authorization: { required: true },
      'Refresh-Token': { required: true },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Password does not match',
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @UsePipes(new JoiValidationPipe(signInSchema))
  async signIn(@Body() signInDto: SignInDto, @Response() res: Res) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    return res
      .set({ Authorization: accessToken, 'Refresh-Token': refreshToken })
      .json();
  }

  @ApiOperation({ summary: 'Refresh Token' })
  @ApiResponse({
    status: 200,
    description: 'Refresh Token',
    headers: {
      Authorization: { required: true },
      'Refresh-Token': { required: true },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied',
  })
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization' })
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshTokens(@Request() req: Req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout',
  })
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization' })
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Request() req: Req) {
    this.authService.logout(req.user['sub']);
  }
}
