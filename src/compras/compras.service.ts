import { Injectable, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
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
    if (!cliente) throw new Error('Cliente não encontrado.')

    const produtos = await this.produtoRepo.findBy({ id: In(dados.produtos) })
    if (!produtos.length) throw new Error('Produtos não encontrados.')

    const total = produtos.reduce((soma, p) => soma + p.preco, 0)

    const novaCompra = this.compraRepo.create({
      clienteId,
      produtos,
      status: 'Pendente',
      total,
    })

    const compraSalva = await this.compraRepo.save(novaCompra)

    await this.cache.del(`compras-cliente-${clienteId}`)

    return compraSalva
  }

  async listarComprasPorCliente(clienteId: number): Promise<Compra[]> {
    const cacheKey = `compras-cliente-${clienteId}`
    const comprasEmCache = await this.cache.get<Compra[]>(cacheKey)

    if (comprasEmCache) return comprasEmCache

    const compras = await this.compraRepo.find({
      where: { clienteId },
      relations: ['produtos'],
    })

    await this.cache.set(cacheKey, compras, 60000)

    return compras
  }
}
