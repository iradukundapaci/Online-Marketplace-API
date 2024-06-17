// src/users/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Admin, GetUser } from 'src/auth/decorator';
import { CreateUserDto } from './dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // User: Get own information
  @UseGuards(JwtGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get own user information (all users)' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser('userId') userId: number) {
    return this.userService.findOne(userId);
  }

  // User: Update own information
  @UseGuards(JwtGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Update own user information (all users)' })
  @ApiResponse({
    status: 200,
    description: 'User information updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  updateMe(
    @GetUser('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  // User: Delete own account
  @UseGuards(JwtGuard)
  @Delete('me')
  @ApiOperation({ summary: 'Delete own user account (all users)' })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  deleteMe(@GetUser('userId') userId: number) {
    return this.userService.remove(userId);
  }

  // Admin: Create a new user
  @UseGuards(JwtGuard, RolesGuard)
  @Admin()
  @Post()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Admin: Get all users
  @UseGuards(JwtGuard, RolesGuard)
  @Admin()
  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll();
  }

  // Admin: Get a user by ID
  @UseGuards(JwtGuard, RolesGuard)
  @Admin()
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // Admin: Update a user by ID
  @UseGuards(JwtGuard, RolesGuard)
  @Admin()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID (admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // Admin: Delete a user by ID
  @UseGuards(JwtGuard, RolesGuard)
  @Admin()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID (admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
