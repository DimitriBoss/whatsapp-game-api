import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { WhatsappService } from './whatsapp/whatsapp.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly whatsappService: WhatsappService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('qr')
  @Header('Content-Type', 'text/html')
  getQrPage(): string {
    const qr = this.whatsappService.getCurrentQr();
    if (!qr) {
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>QR Code WhatsApp</title>
  </head>
  <body>
    <h1>QR Code WhatsApp indisponible</h1>
    <p>Le QR code n'a pas encore été généré ou le bot est déjà connecté.</p>
    <p>Redémarre le serveur et consulte les logs pour voir le code QR.</p>
  </body>
</html>`;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qr)}`;
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>QR Code WhatsApp</title>
  </head>
  <body>
    <h1>QR Code WhatsApp</h1>
    <p>Scanne ce QR code avec ton application WhatsApp :</p>
    <img src="${qrUrl}" alt="QR Code WhatsApp" />
    <p>Si l'image n'apparaît pas, ouvre ce lien dans un navigateur : <a href="${qrUrl}">${qrUrl}</a></p>
  </body>
</html>`;
  }

  @Get('status')
  getStatus() {
    const connectedAt = this.whatsappService.getConnectedAt();
    return {
      status: connectedAt ? 'online' : 'offline',
      uptime: process.uptime(),
      connectedAt,
      version: '2.0.0',
    };
  }

  @Get('version')
  getVersion() {
    return {
      version: '2.0.0',
      name: 'WhatsApp Game Bot API',
    };
  }
}
