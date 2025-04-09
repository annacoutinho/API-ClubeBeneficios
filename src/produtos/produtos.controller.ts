import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ProdutosService } from './produtos.service'
import { CreateProdutoDto } from './dto/create-produto.dto'

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  async cadastrar(@Body() dados: CreateProdutoDto) {
    return this.produtosService.criarProduto(dados)
  }

  @Get()
  async listar(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('nome') nome?: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.produtosService.listarProdutos({ page, limit, nome, categoria })
  }
}
