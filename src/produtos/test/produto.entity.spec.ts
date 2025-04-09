import { Produto } from '../entities/produto.entity'

describe('Produto Entity', () => {
  it('deve criar um produto com os campos corretos', () => {
    const produto = new Produto()
    produto.id = 1
    produto.nome = 'Camisa Polo'
    produto.preco = 59.90
    produto.categoria = 'Roupas'

    expect(produto).toEqual({
      id: 1,
      nome: 'Camisa Polo',
      preco: 59.90,
      categoria: 'Roupas'
    })
  })
})
