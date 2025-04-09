import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from '../produtos.controller';
import { ProdutosService } from '../produtos.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';

describe('ProdutosController', () => {
  let controller: ProdutosController;
  let service: ProdutosService;

  const mockService = {
    criarProduto: jest.fn((dto) => ({
      id: 1,
      ...dto,
    })),
    listarProdutos: jest.fn(({ page, limit, nome, categoria }) => [
      {
        id: 1,
        nome: nome || 'Produto Teste',
        descricao: 'Descrição teste',
        preco: 100,
        categoria: categoria || 'Categoria Teste',
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        {
          provide: ProdutosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProdutosController>(ProdutosController);
    service = module.get<ProdutosService>(ProdutosService);
  });

  it('deve chamar o service para criar um produto', async () => {
    const dto: CreateProdutoDto = {
      nome: 'Camiseta',
      descricao: 'Camiseta de algodão',
      preco: 59.9,
      categoria: 'Vestuário',
    };

    const result = await controller.cadastrar(dto);
    expect(result).toHaveProperty('id');
    expect(service.criarProduto).toHaveBeenCalledWith(dto);
  });

  it('deve listar os produtos com paginação e filtros', async () => {
    const result = await controller.listar(1, 10, 'Camiseta', 'Vestuário');
    expect(Array.isArray(result)).toBe(true);
    expect(service.listarProdutos).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      nome: 'Camiseta',
      categoria: 'Vestuário',
    });
  });
});
