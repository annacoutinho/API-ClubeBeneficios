import { Controller, Get } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private relatoriosService: RelatoriosService) {}

  @Get('vendas')
  gerarRelatorio() {
    return this.relatoriosService.gerarRelatorioVendas();
  }
}
