import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'
import { Public } from './decorators/public.decorator'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() { email, senha }: { email: string; senha: string }) {
    const cliente = await this.authService.validateCliente(email, senha)

    if (!cliente) {
      throw new UnauthorizedException('Email ou senha inválidos.')
    }

    return this.authService.login(cliente)
  }
}
