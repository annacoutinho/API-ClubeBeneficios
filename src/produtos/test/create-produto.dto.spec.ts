import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateProdutoDto } from '../dto/create-produto.dto'

describe('CreateProdutoDto', () => {
  it('deve validar um DTO válido', async () => {
    const dto = {
      nome: 'Produto Teste',
      descricao: 'Descrição do produto',
      preco: 99.99,
      categoria: 'Eletrônicos',
    }

    const instance = plainToInstance(CreateProdutoDto, dto)
    const errors = await validate(instance)

    expect(errors.length).toBe(0)
  })

  it('deve falhar na validação com campos vazios', async () => {
    const dto = {
      nome: '',
      descricao: '',
      preco: 'valor inválido',
    }

    const instance = plainToInstance(CreateProdutoDto, dto)
    const errors = await validate(instance)

    expect(errors.length).toBeGreaterThan(0)
  })
})
