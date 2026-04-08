// common/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { logger } from './logger';

@Global() // Para que no tengas que importarlo en cada módulo
@Module({
  providers: [
    {
      provide: 'LOGGER',
      useValue: logger, // Usamos tu instancia de Pino ya configurada
    },
  ],
  exports: ['LOGGER'],
})
export class LoggerModule {}
