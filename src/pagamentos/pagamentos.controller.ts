import { Controller, Post, Body } from '@nestjs/common'
import { PagamentosService } from './pagamentos.service'

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post()
  async simular(@Body('compraId') compraId: number) {
    return this.pagamentosService.simularPagamento(compraId)
  }
}
