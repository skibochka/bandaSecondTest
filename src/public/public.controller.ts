import { Controller, Get, Response } from '@nestjs/common';
import * as path from 'path';

@Controller('')
export class PublicController {

  @Get('/register')
  async register(@Response() res ) {
    return res.sendFile(path.join(__dirname, '../../views/register.html'));
  }

  @Get('/login')
  async login(@Response() res ) {
    return res.sendFile(path.join(__dirname, '../../views/login.html'));
  }

  @Get('/posts')
  async blog(@Response() res ) {
    return res.sendFile(path.join(__dirname, '../../views/blog.html'));
  }
}
