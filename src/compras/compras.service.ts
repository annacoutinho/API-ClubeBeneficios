import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, FindOptionsWhere } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

import { Compra } from './entities/compra.entity'
import { Cliente } from 'src/clientes/entities/cliente.entity'
import { Produto } from 'src/produtos/entities/produto.entity'
import { CreateCompraDto } from './dto/create-compra.dto'

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra) private compraRepo: Repository<Compra>,
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
    @InjectRepository(Produto) private produtoRepo: Repository<Produto>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async registrarCompra(dados: CreateCompraDto, clienteId: number): Promise<Compra> {
    const cliente = await this.clienteRepo.findOneBy({ id: clienteId })
    if (!cliente) throw new NotFoundException(`Cliente com ID ${clienteId} não encontrado`)

    const produtos = await this.produtoRepo.findBy({ id: In(dados.produtos) })
    if (produtos.length !== dados.produtos.length) 
      throw new NotFoundException('Um ou mais produtos não foram encontrados')

    const total = produtos.reduce((soma, produto) => soma + produto.preco, 0)

    const novaCompra = this.compraRepo.create({
      clienteId,
      produtos,
      status: 'Pendente',
      total,
    })

    const compraSalva = await this.compraRepo.save(novaCompra)
    await this.limparCacheCliente(clienteId)

    return compraSalva
  }

  async listarComprasPorCliente(clienteId: number): Promise<Compra[]> {
    const cacheKey = `compras-cliente-${clienteId}`
    const comprasEmCache = await this.cache.get<Compra[]>(cacheKey)

    if (comprasEmCache) return comprasEmCache

    const filtro: FindOptionsWhere<Compra> = { clienteId }
    const compras = await this.compraRepo.find({
      where: filtro,
      relations: ['produtos'],
    })

    await this.cache.set(cacheKey, compras, 60000)

    return compras
  }

  private async limparCacheCliente(clienteId: number): Promise<void> {
    const cacheKey = `compras-cliente-${clienteId}`
    await this.cache.del(cacheKey)
  }
}