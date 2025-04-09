import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { ComprasService } from './compras.service'
import { CreateCompraDto } from './dto/create-compra.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  async criar(@Body() dados: CreateCompraDto) {
    return this.comprasService.registrarCompra(dados, dados.clienteId)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async minhasCompras(@CurrentUser() usuario: any) {
    return this.comprasService.listarComprasPorCliente(usuario.id)
  }
}
