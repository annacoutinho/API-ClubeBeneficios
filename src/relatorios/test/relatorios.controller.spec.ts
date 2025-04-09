import { Test, TestingModule } from '@nestjs/testing'
import { RelatoriosController } from '../relatorios.controller'
import { RelatoriosService } from '../relatorios.service'

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
            gerarRelatorioVendas: jest
              .fn()
              .mockResolvedValue('Relatório gerado com sucesso'),
          },
        },
      ],
    }).compile()

    controller = module.get<RelatoriosController>(RelatoriosController)
    service = module.get<RelatoriosService>(RelatoriosService)
  })

  it('deve retornar o relatório de vendas', async () => {
    const resultado = await controller.gerarRelatorio()
    expect(resultado).toBe('Relatório gerado com sucesso')
    expect(service.gerarRelatorioVendas).toHaveBeenCalled()
  })
})
