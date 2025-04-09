import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ProdutosService } from './produtos.service'
import { CreateProdutoDto } from './dto/create-produto.dto'
import { Produto } from './entities/produto.entity'

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  async cadastrarNovoProduto(
    @Body() dadosProduto: CreateProdutoDto,
  ): Promise<Produto> {
    return this.produtosService.criarProduto(dadosProduto)
  }

  @Get()
  async listarProdutos(
    @Query('page') pagina: number = 1,
    @Query('limit') limite: number = 10,
    @Query('nome') nome?: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.produtosService.listarProdutos({
      page: Number(pagina),
      limit: Number(limite),
      nome,
      categoria,
    })
  }
}
