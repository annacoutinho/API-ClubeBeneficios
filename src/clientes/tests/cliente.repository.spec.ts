import { ClientesRepository } from '../repositories/clientes.repository'
import { Cliente, TipoUsuario } from '../entities/cliente.entity'
import { Repository } from 'typeorm'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('ClientesRepository', () => {
  let clientesRepository: ClientesRepository
  let mockRepo: jest.Mocked<Repository<Cliente>>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ClientesRepository,
        {
          provide: getRepositoryToken(Cliente),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    clientesRepository = moduleRef.get(ClientesRepository)
    mockRepo = moduleRef.get(getRepositoryToken(Cliente))
  })

  it('deve retornar todos os clientes', async () => {
    const clientes = [
      {
        id: 1,
        nome: 'Anna',
        email: 'anna@email.com',
        senha: '123456',
        tipoUsuario: TipoUsuario.CLIENTE,
      },
    ]
    mockRepo.find.mockResolvedValue(clientes as Cliente[])

    const resultado = await clientesRepository.findAll()
    expect(resultado).toEqual(clientes)
    expect(mockRepo.find).toHaveBeenCalled()
  })

  it('deve retornar cliente por email', async () => {
    const cliente = {
      id: 1,
      nome: 'Anna',
      email: 'anna@email.com',
      senha: '123456',
      tipoUsuario: TipoUsuario.CLIENTE,
    }
    mockRepo.findOne.mockResolvedValue(cliente as Cliente)

    const resultado = await clientesRepository.findByEmail('anna@email.com')
    expect(resultado).toEqual(cliente)
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'anna@email.com' },
    })
  })

  it('deve criar um novo cliente', async () => {
    const clienteDTO = {
      nome: 'Novo',
      email: 'novo@email.com',
      senha: 'senha123',
    }
    const clienteCriado = {
      ...clienteDTO,
      id: 2,
      tipoUsuario: TipoUsuario.CLIENTE,
    }

    mockRepo.create.mockReturnValue(clienteCriado as Cliente)
    mockRepo.save.mockResolvedValue(clienteCriado as Cliente)

    const resultado = await clientesRepository.create(clienteDTO)
    expect(mockRepo.create).toHaveBeenCalledWith(clienteDTO)
    expect(mockRepo.save).toHaveBeenCalledWith(clienteCriado)
    expect(resultado).toEqual(clienteCriado)
  })
})
