import { Test, TestingModule } from '@nestjs/testing'
import { ClientesService } from '../clientes.service'
import { ClientesRepository } from '../repositories/clientes.repository'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { TipoUsuario } from '../entities/cliente.entity'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt') 

describe('ClientesService', () => {
  let service: ClientesService
  let clientesRepository: jest.Mocked<ClientesRepository>

  beforeEach(async () => {
    const mockClientesRepository = {
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: ClientesRepository,
          useValue: mockClientesRepository,
        },
      ],
    }).compile()

    service = module.get<ClientesService>(ClientesService)
    clientesRepository = module.get(
      ClientesRepository,
    ) as jest.Mocked<ClientesRepository>
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should throw UnauthorizedException if not admin', async () => {
      await expect(service.findAll(TipoUsuario.CLIENTE)).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should return all clients if admin', async () => {
      const mockClients = [{ id: 1, nome: 'Anna' }]
      clientesRepository.findAll.mockResolvedValue(mockClients as any)

      const result = await service.findAll(TipoUsuario.ADMIN)
      expect(result).toEqual(mockClients)
    })
  })

  describe('create', () => {
    const dto = {
      email: 'anna@example.com',
      senha: '123456',
      nome: 'Anna',
    }

    it('should throw ConflictException if email already exists', async () => {
      clientesRepository.findByEmail.mockResolvedValue({ id: 1 } as any)

      await expect(service.create(dto as any)).rejects.toThrow(
        ConflictException,
      )
    })

    it('should create client with hashed password', async () => {
      clientesRepository.findByEmail.mockResolvedValue(null)
      const hashMock = 'hashed_password'
      ;(bcrypt.genSalt as jest.Mock).mockResolvedValue('salt')
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashMock)

      clientesRepository.create.mockResolvedValue({
        id: 1,
        ...dto,
        senha: hashMock,
      } as any)

      const result = await service.create(dto as any)
      expect(result.senha).toBe(hashMock)
      expect(clientesRepository.create).toHaveBeenCalledWith({
        ...dto,
        senha: hashMock,
      })
    })
  })
})
