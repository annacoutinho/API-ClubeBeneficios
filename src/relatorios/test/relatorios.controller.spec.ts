import { Test, TestingModule } from '@nestjs/testing'
import { RelatoriosController } from '../relatorios.controller'
import { RelatoriosService } from '../relatorios.service'
import { RelatorioVendas } from '../relatorios.service'

describe('RelatoriosController', () => {
  let controller: RelatoriosController
  let service: RelatoriosService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatoriosController],
      providers: [
        {
          provide: RelatoriosService,
          useValue: {
            gerarRelatorioVendas: jest.fn().mockResolvedValue({
              1: {
                produto: 'Produto Teste',
                totalVendas: 10,
                totalValor: 1000,
              },
            }),
          },
        },
      ],
    }).compile()

    controller = module.get<RelatoriosController>(RelatoriosController)
    service = module.get<RelatoriosService>(RelatoriosService)
  })

  describe('obterRelatorioConsolidadoDeVendas', () => {
    it('deve retornar o relatório de vendas no formato correto', async () => {
      const mockRelatorio: Record<number, RelatorioVendas> = {
        1: {
          produto: 'Produto Teste',
          totalVendas: 10,
          totalValor: 1000,
        },
      }

      jest
        .spyOn(service, 'gerarRelatorioVendas')
        .mockResolvedValue(mockRelatorio)

      const resultado = await controller.obterRelatorioConsolidadoDeVendas()

      expect(resultado).toEqual(mockRelatorio)
      expect(service.gerarRelatorioVendas).toHaveBeenCalled()
    })

    it('deve chamar o serviço corretamente', async () => {
      await controller.obterRelatorioConsolidadoDeVendas()
      expect(service.gerarRelatorioVendas).toHaveBeenCalledTimes(1)
    })
  })
})
