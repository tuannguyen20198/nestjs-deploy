import { Controller,Post, UseGuards,Request,Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService:AuthService,
    ) 
    {}
}
