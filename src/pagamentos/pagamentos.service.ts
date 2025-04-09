import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Compra } from '../compras/entities/compra.entity'

@Injectable()
export class PagamentosService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
  ) {}

  async simularPagamento(compraId: number) {
    const compra = await this.compraRepository.findOne({ where: { id: compraId } })

    if (!compra) {
      throw new NotFoundException(`Compra com o ID ${compraId} não foi encontrada.`)
    }

    compra.status = 'Pago'
    await this.compraRepository.save(compra)

    return { message: 'Pagamento realizado com sucesso.' }
  }
}
