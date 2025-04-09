import { Injectable, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Compra } from '../compras/entities/compra.entity'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

interface ProdutoRelatorio {
  id: number
  nome: string
  preco: number
}

interface RelatorioVendas {
  produto: string
  totalVendas: number
  totalValor: number
}

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectRepository(Compra)
    private compraRepo: Repository<Compra>,

    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  async gerarRelatorioVendas(): Promise<Record<number, RelatorioVendas>> {
    const cacheKey = 'relatorio-vendas'
    const emCache =
      await this.cache.get<Record<number, RelatorioVendas>>(cacheKey)

    if (emCache) {
      return emCache
    }

    const compras = await this.compraRepo.find({
      relations: ['produtos'],
    })

    const relatorio = compras.reduce(
      (dados: Record<number, RelatorioVendas>, compra) => {
        compra.produtos.forEach((produto: ProdutoRelatorio) => {
          if (!dados[produto.id]) {
            dados[produto.id] = {
              produto: produto.nome,
              totalVendas: 0,
              totalValor: 0,
            }
          }
          dados[produto.id].totalVendas += 1
          dados[produto.id].totalValor += produto.preco
        })
        return dados
      },
      {} as Record<number, RelatorioVendas>,
    )

    await this.cache.set(cacheKey, relatorio, 60000)
    return relatorio
  }
}
