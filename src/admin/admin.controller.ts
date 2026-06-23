import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { QuestionType, Difficulty } from '@prisma/client';

@Controller('admin')
@UseGuards(ApiKeyGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('errors')
  async getErrors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;
    return this.adminService.getErrors(p, l);
  }

  @Get('users')
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;
    return this.adminService.getUsers(p, l, search);
  }

  @Get('sessions')
  async getSessions() {
    return this.adminService.getSessions();
  }

  @Post('questions')
  async createQuestion(
    @Body()
    body: {
      text: string;
      answer?: string;
      type: QuestionType;
      category?: string;
      difficulty?: Difficulty;
      language?: string;
    },
  ) {
    const question = await this.adminService.createQuestion(body);
    await this.adminService.logAdminAction('API_KEY', 'CREATE_QUESTION', question.id, body);
    return question;
  }

  @Put('questions/:id')
  async updateQuestion(
    @Param('id') id: string,
    @Body()
    body: {
      text?: string;
      answer?: string;
      type?: QuestionType;
      category?: string;
      difficulty?: Difficulty;
      language?: string;
      active?: boolean;
    },
  ) {
    const question = await this.adminService.updateQuestion(id, body);
    await this.adminService.logAdminAction('API_KEY', 'UPDATE_QUESTION', id, body);
    return question;
  }

  @Delete('questions/:id')
  async deleteQuestion(@Param('id') id: string) {
    const question = await this.adminService.deleteQuestion(id);
    await this.adminService.logAdminAction('API_KEY', 'DELETE_QUESTION', id);
    return question;
  }
}
