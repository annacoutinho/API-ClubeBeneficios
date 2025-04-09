import { validate } from 'class-validator';
import { CreateCompraDto } from '../dto/create-compra.dto';

describe('Criando uma Compra', () => {
  it('tudo ok com os produtos', async () => {
    const pedido = new CreateCompraDto();
    pedido.produtos = [1, 5, 10];
    pedido.clienteId = 99;

    const problemas = await validate(pedido);
    expect(problemas.length).toBe(0);
  });

  it('sem produto na compra', async () => {
    const pedidoSemProdutos = new CreateCompraDto();
    pedidoSemProdutos.produtos = [];
    pedidoSemProdutos.clienteId = 99;

    const problemas = await validate(pedidoSemProdutos);
    expect(problemas.length).toBe(1);
    expect(problemas[0].property).toBe('produtos');
    expect(problemas[0].constraints?.arrayNotEmpty).toBe('produtos should not be empty');
  });



  it('a compra necessita ter cliente', async () => {
    const pedidoSemCliente = new CreateCompraDto();
    pedidoSemCliente.produtos = [1, 2, 3];

    const problemas = await validate(pedidoSemCliente);
    expect(problemas.length).toBe(1);
    expect(problemas[0].property).toBe('clienteId');
    expect(problemas[0].constraints?.isNotEmpty).toBe('clienteId should not be empty');
  });

  it('ID do cliente é inteiro', async () => {
    const pedidoComClienteTexto = new CreateCompraDto();
    pedidoComClienteTexto.produtos = [1, 2, 3];
    pedidoComClienteTexto.clienteId = 'noventa e nove' as any;

    const problemas = await validate(pedidoComClienteTexto);
    expect(problemas.length).toBe(1);
    expect(problemas[0].property).toBe('clienteId');
    expect(problemas[0].constraints?.isInt).toBe('clienteId must be an integer number');
  });
});