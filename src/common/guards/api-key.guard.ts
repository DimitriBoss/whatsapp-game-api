import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] || request.headers['X-Api-Key'];
    const expectedKey = process.env.ADMIN_API_KEY;

    if (!expectedKey) {
      throw new UnauthorizedException('La clé API d\'administration n\'est pas configurée sur le serveur.');
    }

    if (apiKey !== expectedKey) {
      throw new UnauthorizedException('Clé API invalide.');
    }

    return true;
  }
}
