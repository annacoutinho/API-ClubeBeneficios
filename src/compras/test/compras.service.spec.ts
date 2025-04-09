import { Test, TestingModule } from '@nestjs/testing';
import { ComprasService } from '../compras.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Compra } from '../entities/compra.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Produto } from 'src/produtos/entities/produto.entity';

describe('ComprasService', () => {
  let service: ComprasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComprasService,
        { provide: getRepositoryToken(Compra), useValue: {} },
        { provide: getRepositoryToken(Cliente), useValue: {} },
        { provide: getRepositoryToken(Produto), useValue: {} },
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() } },
      ],
    }).compile();

    service = module.get<ComprasService>(ComprasService);
  });

  it('deve criar o serviço', () => {
    expect(service).toBeDefined();
  });
});
