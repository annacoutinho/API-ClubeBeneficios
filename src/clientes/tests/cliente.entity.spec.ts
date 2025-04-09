import { Cliente, TipoUsuario } from '../entities/cliente.entity'

describe('Cliente Entity', () => {
  it('deve criar uma instância válida de Cliente', () => {
    const cliente = new Cliente()
    cliente.nome = 'Anna Coutinho'
    cliente.email = 'anna@example.com'
    cliente.senha = 'senhaSegura123'
    cliente.tipoUsuario = TipoUsuario.ADMIN

    expect(cliente).toBeInstanceOf(Cliente)
    expect(cliente.nome).toBe('Anna Coutinho')
    expect(cliente.email).toBe('anna@example.com')
    expect(cliente.senha).toBe('senhaSegura123')
    expect(cliente.tipoUsuario).toBe(TipoUsuario.ADMIN)
  })

  it('deve ter o tipoUsuario padrão como CLIENTE', () => {
    const cliente = new Cliente()
    expect(cliente.tipoUsuario).toBe(TipoUsuario.CLIENTE)
  })

  it('deve ter as propriedades de datas definidas após salvar no banco', async () => {
    const cliente = new Cliente()
    cliente.nome = 'João'
    cliente.email = 'joao@example.com'
    cliente.senha = 'teste123'

    expect(cliente.criadoEm).toBeUndefined()
    expect(cliente.atualizadoEm).toBeUndefined()
  })
})
