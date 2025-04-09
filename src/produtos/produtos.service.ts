import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { Produto } from './entities/produto.entity'
import { CreateProdutoDto } from './dto/create-produto.dto'
import { Cache } from 'cache-manager'

export interface PaginacaoProdutos {
  page: number
  limit: number
  nome?: string
  categoria?: string
}

export interface ResultadoPaginado<T> {
  data: T[]
  totalItems: number
  currentPage: number
  totalPages: number
}

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async criarProduto(dados: CreateProdutoDto): Promise<Produto> {
    const novoProduto = this.produtoRepository.create(dados)
    const produtoSalvo = await this.produtoRepository.save(novoProduto)

    await this.cacheManager.del('produtos-lita')

    return produtoSalvo
  }

  async listarProdutos(
    filtros: PaginacaoProdutos,
  ): Promise<ResultadoPaginado<Produto>> {
    const { page, limit, nome, categoria } = filtros

    const chaveCache = `produtos:${page}:${limit}:${nome || 'todos'}:${categoria || 'todas'}`
    const cacheado =
      await this.cacheManager.get<ResultadoPaginado<Produto>>(chaveCache)

    if (cacheado) {
      return cacheado
    }

    const [produtos, total] = await this.produtoRepository.findAndCount({
      where: {
        nome: nome ? ILike(`%${nome}%`) : undefined,
        categoria: categoria ? ILike(`%${categoria}%`) : undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const resultado: ResultadoPaginado<Produto> = {
      data: produtos,
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    }

    await this.cacheManager.set(chaveCache, resultado, 60)

    return resultado
  }
}
