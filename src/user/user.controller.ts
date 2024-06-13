import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Admin, GetUser } from 'src/auth/decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Admin: Create a new user
  @UseGuards(JwtGuard, RolesGuard)
  //@Admin()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Admin: Get all users
  @UseGuards(JwtGuard)
  //@Admin()
  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  // Admin: Get a user by ID
  @UseGuards(JwtGuard, RolesGuard)
  //@Admin()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // Admin: Update a user by ID
  @UseGuards(JwtGuard, RolesGuard)
  //@Admin()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // Admin: Delete a user by ID
  @UseGuards(JwtGuard, RolesGuard)
  //@Admin()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  // User: Get own information
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser('userId') userId: number) {
    return this.userService.findOne(userId);
  }

  // User: Update own information
  @UseGuards(JwtGuard)
  @Patch('me')
  updateMe(
    @GetUser('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  // User: Delete own account
  @UseGuards(JwtGuard)
  @Delete('me')
  deleteMe(@GetUser('userId') userId: number) {
    return this.userService.remove(userId);
  }
}
