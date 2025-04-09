import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { Produto } from './entities/produto.entity'
import { CreateProdutoDto } from './dto/create-produto.dto'
import { Cache } from 'cache-manager'

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,

    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  async criarProduto(dados: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtoRepo.create(dados)
    const salvo = await this.produtoRepo.save(produto)

    await this.cache.del('produtos-lista')

    return salvo
  }

  async listarProdutos({
    page,
    limit,
    nome,
    categoria,
  }: {
    page: number
    limit: number
    nome?: string
    categoria?: string
  }) {
    const chaveCache = `produtos:${page}:${limit}:${nome || 'todos'}:${categoria || 'todas'}`
    const cacheado = await this.cache.get(chaveCache)

    if (cacheado) return cacheado as any

    const [produtos, total] = await this.produtoRepo.findAndCount({
      where: {
        nome: nome ? ILike(`%${nome}%`) : undefined,
        categoria: categoria ? ILike(`%${categoria}%`) : undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const resultado = {
      data: produtos,
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    }

    await this.cache.set(chaveCache, resultado, 60)

    return resultado
  }
}
