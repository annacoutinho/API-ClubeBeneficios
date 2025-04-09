import { Test, TestingModule } from '@nestjs/testing'
import { RelatoriosService } from '../relatorios.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Compra } from '../../compras/entities/compra.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

describe('RelatoriosService', () => {
  let service: RelatoriosService
  let compraRepoMock: any
  let cacheMock: any

  beforeEach(async () => {
    compraRepoMock = {
      find: jest.fn(),
    }

    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelatoriosService,
        {
          provide: getRepositoryToken(Compra),
          useValue: compraRepoMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheMock,
        },
      ],
    }).compile()

    service = module.get<RelatoriosService>(RelatoriosService)
  })

  it('deve retornar dados do cache se disponíveis', async () => {
    const relatorioFake = {
      1: { produto: 'Produto X', totalVendas: 2, totalValor: 100 },
    }
    cacheMock.get.mockResolvedValue(relatorioFake)

    const resultado = await service.gerarRelatorioVendas()

    expect(cacheMock.get).toHaveBeenCalledWith('relatorio-vendas')
    expect(resultado).toEqual(relatorioFake)
  })

  it('deve gerar e retornar relatório se não estiver em cache', async () => {
    cacheMock.get.mockResolvedValue(null)
    const comprasFake = [
      {
        produtos: [
          { id: 1, nome: 'Produto A', preco: 50 },
          { id: 1, nome: 'Produto A', preco: 50 },
        ],
      },
    ]
    compraRepoMock.find.mockResolvedValue(comprasFake)

    const resultado = await service.gerarRelatorioVendas()

    expect(resultado).toEqual({
      1: {
        produto: 'Produto A',
        totalVendas: 2,
        totalValor: 100,
      },
    })

    expect(cacheMock.set).toHaveBeenCalled()
  })
})
