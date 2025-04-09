import { Test, TestingModule } from '@nestjs/testing'
import { ClientesController } from '../clientes.controller'
import { ClientesService } from '../clientes.service'
import { CreateClienteDto } from '../dto/create-cliente.dto'
import { Cliente, TipoUsuario } from '../entities/cliente.entity'

describe('ClientesController', () => {
  let controller: ClientesController
  let service: ClientesService

  const mockCliente: Cliente = {
    id: 1,
    nome: 'Anna',
    email: 'anna@example.com',
    senha: '123456',
    tipoUsuario: TipoUsuario.CLIENTE,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  }

  const mockClientesService = {
    findAll: jest.fn().mockResolvedValue([mockCliente]),
    create: jest.fn().mockResolvedValue(mockCliente),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: ClientesService,
          useValue: mockClientesService,
        },
      ],
    }).compile()

    controller = module.get<ClientesController>(ClientesController)
    service = module.get<ClientesService>(ClientesService)
  })

  it('deve ser definido', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('deve retornar uma lista de clientes', async () => {
      const result = await controller.findAll({
        tipoUsuario: TipoUsuario.ADMIN,
      })
      expect(result).toEqual([mockCliente])
      expect(service.findAll).toHaveBeenCalledWith(TipoUsuario.ADMIN)
    })
  })

  describe('create', () => {
    it('deve criar um novo cliente', async () => {
      const dto: CreateClienteDto = {
        nome: 'Anna',
        email: 'anna@example.com',
        senha: '123456',
        tipoUsuario: TipoUsuario.CLIENTE,
      }

      const result = await controller.create(dto)
      expect(result).toEqual(mockCliente)
      expect(service.create).toHaveBeenCalledWith(dto)
    })
  })
})
