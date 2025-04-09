import { Test, TestingModule } from '@nestjs/testing'
import { ProdutosService } from '../produtos.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Produto } from '../entities/produto.entity'
import { Cache } from 'cache-manager'
import { Repository } from 'typeorm'

describe('ProdutosService', () => {
  let service: ProdutosService
  let repo: Repository<Produto>
  let cache: Cache

  const mockProduto = {
    id: 1,
    nome: 'Produto Teste',
    descricao: 'Descrição do produto',
    preco: 100,
    categoria: 'Categoria Teste',
  }

  const mockProdutoRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockProduto),
    findAndCount: jest.fn().mockResolvedValue([[mockProduto], 1]),
  }

  const mockCache = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn(),
    del: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: getRepositoryToken(Produto),
          useValue: mockProdutoRepo,
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCache,
        },
      ],
    }).compile()

    service = module.get<ProdutosService>(ProdutosService)
    repo = module.get<Repository<Produto>>(getRepositoryToken(Produto))
    cache = module.get<Cache>('CACHE_MANAGER')
  })

  it('deve criar um produto', async () => {
    const dto = {
      nome: 'Produto Teste',
      descricao: 'Descrição',
      preco: 100,
      categoria: 'Categoria',
    }

    const result = await service.criarProduto(dto)
    expect(repo.create).toHaveBeenCalledWith(dto)
    expect(repo.save).toHaveBeenCalledWith(dto)
    expect(cache.del).toHaveBeenCalledWith('produtos-lista')
    expect(result).toEqual(mockProduto)
  })

  it('deve listar produtos (sem cache)', async () => {
    const result = await service.listarProdutos({ page: 1, limit: 10 })

    expect(cache.get).toHaveBeenCalled()
    expect(repo.findAndCount).toHaveBeenCalled()
    expect(cache.set).toHaveBeenCalled()
    expect(result.data).toEqual([mockProduto])
    expect(result.totalItems).toBe(1)
    expect(result.currentPage).toBe(1)
    expect(result.totalPages).toBe(1)
  })
})
