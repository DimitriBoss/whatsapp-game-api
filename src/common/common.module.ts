import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApiKeyGuard } from './guards/api-key.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { ErrorLogService } from './services/error-log.service';

@Module({
  imports: [PrismaModule],
  providers: [ApiKeyGuard, RateLimitGuard, ErrorLogService],
  exports: [ApiKeyGuard, RateLimitGuard, ErrorLogService],
})
export class CommonModule {}
