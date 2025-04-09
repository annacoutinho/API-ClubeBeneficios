import { Controller, Get } from '@nestjs/common';
import { RelatoriosService, RelatorioVendas } from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {
  constructor(
    private readonly relatorioService: RelatoriosService
  ) {}

  @Get('vendas')
  async obterRelatorioConsolidadoDeVendas(): Promise<Record<number, RelatorioVendas>> {
    return this.relatorioService.gerarRelatorioVendas();
  }
}