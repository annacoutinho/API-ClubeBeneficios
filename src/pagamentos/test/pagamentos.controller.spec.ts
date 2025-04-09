import { Test, TestingModule } from '@nestjs/testing';
import { PagamentosController } from '../pagamentos.controller';
import { PagamentosService } from '../pagamentos.service';

describe('PagamentosController', () => {
  let controller: PagamentosController;
  let service: PagamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagamentosController],
      providers: [
        {
          provide: PagamentosService,
          useValue: {
            simularPagamento: jest.fn().mockResolvedValue({
              status: 'Aprovado',
              valor: 100,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PagamentosController>(PagamentosController);
    service = module.get<PagamentosService>(PagamentosService);
  });

  it('deve retornar a simulação de pagamento', async () => {
    const result = await controller.simular(1);

    expect(service.simularPagamento).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      status: 'Aprovado',
      valor: 100,
    });
  });
});
