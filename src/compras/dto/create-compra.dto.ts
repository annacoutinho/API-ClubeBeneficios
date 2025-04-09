import { IsNotEmpty, IsArray, ArrayNotEmpty, IsInt } from 'class-validator'

export class CreateCompraDto {
  @IsNotEmpty({ message: 'A lista de produtos é obrigatória.' })
  @IsArray({ message: 'Produtos deve ser uma lista de IDs.' })
  @ArrayNotEmpty({ message: 'É necessário selecionar ao menos um produto.' })
  @IsInt({ each: true, message: 'Cada produto deve ter um ID numérico válido.' })
  produtos: number[]

  @IsNotEmpty({ message: 'O ID do cliente é obrigatório.' })
  @IsInt({ message: 'O ID do cliente deve ser um número inteiro.' })
  clienteId: number
}
