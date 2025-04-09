import { validate } from 'class-validator'
import { CreateClienteDto } from '../dto/create-cliente.dto'
import { TipoUsuario } from '../entities/cliente.entity'

describe('CreateClienteDto', () => {
  it('deve ser válido com todos os campos corretos', async () => {
    const dto = new CreateClienteDto()
    dto.nome = 'Anna Coutinho'
    dto.email = 'anna@example.com'
    dto.senha = '123456'
    dto.tipoUsuario = TipoUsuario.CLIENTE

    const erros = await validate(dto)
    expect(erros.length).toBe(0)
  })

  it('deve falhar quando o nome está vazio', async () => {
    const dto = new CreateClienteDto()
    dto.nome = ''
    dto.email = 'anna@example.com'
    dto.senha = '123457'
    dto.tipoUsuario = TipoUsuario.CLIENTE

    const erros = await validate(dto)
    expect(erros).toHaveLength(1)
    expect(erros[0].property).toBe('nome')
  })

  it('deve falhar quando o email é inválido', async () => {
    const dto = new CreateClienteDto()
    dto.nome = 'Anna Coutinho'
    dto.email = 'anna.com'
    dto.senha = '123456'
    dto.tipoUsuario = TipoUsuario.CLIENTE

    const erros = await validate(dto)
    expect(erros).toHaveLength(1)
    expect(erros[0].property).toBe('email')
  })

  it('deve falhar quando a senha tem menos de 6 caracteres', async () => {
    const dto = new CreateClienteDto()
    dto.nome = 'Anna Coutinho'
    dto.email = 'anna@example.com'
    dto.senha = '123'
    dto.tipoUsuario = TipoUsuario.CLIENTE

    const erros = await validate(dto)
    expect(erros).toHaveLength(1)
    expect(erros[0].property).toBe('senha')
  })

  it('deve falhar quando o tipoUsuario é inválido', async () => {
    const dto = new CreateClienteDto()
    dto.nome = 'Anna Coutinho'
    dto.email = 'anna@example.com'
    dto.senha = '123456'
    dto.tipoUsuario = 'invalid' as any

    const erros = await validate(dto)
    expect(erros).toHaveLength(1)
    expect(erros[0].property).toBe('tipoUsuario')
  })
})
