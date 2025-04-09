import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable, tap, catchError } from 'rxjs'
import { Request } from 'express'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('Requisições')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>()
    const { method, url } = req
    const inicio = Date.now()

    return next.handle().pipe(
      tap(() => {
        const tempo = Date.now() - inicio
        this.logger.log(`${method} ${url} - concluído em ${tempo}ms`)
      }),
      catchError((error) => {
        this.logger.error(`${method} ${url} - erro: ${error.message}`)
        throw error
      }),
    )
  }
}
