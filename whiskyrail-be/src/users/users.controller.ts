import { Controller, Get, Param, Put, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/:id - 단일 사용자 조회
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id));
  }

  // GET /users - 전체 사용자 목록 조회
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // PUT /users/:id - 사용자 정보 업데이트
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateUser(Number(id), data);
  }

  // DELETE /users/:id - 사용자 삭제 (옵션)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}
