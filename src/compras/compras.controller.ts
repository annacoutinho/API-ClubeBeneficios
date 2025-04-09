import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { ComprasService } from './compras.service'
import { CreateCompraDto } from './dto/create-compra.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  async registrarCompra(@Body() dados: CreateCompraDto) {
    return this.comprasService.registrarCompra(dados, dados.clienteId)
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async listarCompras(@CurrentUser() user) {
    return this.comprasService.listarComprasPorCliente(user.id)
  }
}
