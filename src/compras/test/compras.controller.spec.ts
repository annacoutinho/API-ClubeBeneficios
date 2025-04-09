import { Test, TestingModule } from '@nestjs/testing'
import { ComprasController } from '../compras.controller'
import { ComprasService } from '../compras.service'

describe('ComprasController', () => {
  let controller: ComprasController
  let service: ComprasService

  beforeEach(async () => {
    const mockService = {
      registrarCompra: jest.fn(),
      listarComprasPorCliente: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComprasController],
      providers: [{ provide: ComprasService, useValue: mockService }],
    }).compile()

    controller = module.get<ComprasController>(ComprasController)
    service = module.get<ComprasService>(ComprasService)
  })

  it('deve chamar registrarCompra ao criar uma compra', async () => {
    const mockDados = { clienteId: 123, produtos: [101, 102], preco: 100 } 
    await controller.criar(mockDados)
    expect(service.registrarCompra).toHaveBeenCalledWith(
      mockDados,
      mockDados.clienteId,
    )
  })

  it('deve chamar listarComprasPorCliente para o cliente autenticado', async () => {
    const mockUsuario = { id: 123 }
    await controller.minhasCompras(mockUsuario)
    expect(service.listarComprasPorCliente).toHaveBeenCalledWith(mockUsuario.id)
  })
})
