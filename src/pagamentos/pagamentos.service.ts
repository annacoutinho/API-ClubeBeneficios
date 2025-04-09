import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from '../compras/entities/compra.entity';

export interface ResultadoPagamento {
  message: string;
  compraId?: number;
  status?: string;
}

@Injectable()
export class PagamentosService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
  ) {}

  async simularPagamento(compraId: number): Promise<ResultadoPagamento> {
    const compra = await this.compraRepository.findOne({ 
      where: { id: compraId } 
    });

    if (!compra) {
      throw new NotFoundException(`Compra com ID ${compraId} não encontrada`);
    }

    compra.status = 'Pago';
    const compraAtualizada = await this.compraRepository.save(compra);

    return { 
      message: 'Pagamento realizado com sucesso',
      compraId: compraAtualizada.id,
      status: compraAtualizada.status
    };
  }
}