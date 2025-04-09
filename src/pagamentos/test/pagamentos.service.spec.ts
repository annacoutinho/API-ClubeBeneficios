import { Test, TestingModule } from '@nestjs/testing'
import { PagamentosService } from '../pagamentos.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Compra } from '../../compras/entities/compra.entity'
import { NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'

describe('PagamentosService', () => {
  let service: PagamentosService
  let compraRepository: Repository<Compra>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentosService,
        {
          provide: getRepositoryToken(Compra),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<PagamentosService>(PagamentosService)
    compraRepository = module.get<Repository<Compra>>(getRepositoryToken(Compra))
  })

  it('deve simular o pagamento com sucesso', async () => {
    const compraMock = { id: 1, status: 'Pendente' } as Compra
    jest.spyOn(compraRepository, 'findOne').mockResolvedValue(compraMock)
    jest.spyOn(compraRepository, 'save').mockResolvedValue({ ...compraMock, status: 'Pago' })

    const result = await service.simularPagamento(1)

    expect(result).toEqual({ message: 'Pagamento realizado com sucesso.' })
    expect(compraRepository.save).toHaveBeenCalledWith({ ...compraMock, status: 'Pago' })
  })

  it('deve lançar exceção se a compra não for encontrada', async () => {
    jest.spyOn(compraRepository, 'findOne').mockResolvedValue(null)

    await expect(service.simularPagamento(999)).rejects.toThrow(NotFoundException)
  })
})
