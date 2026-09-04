import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { RestaurantsModule } from './modules/restaurants/restaurants.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    ...(process.env.NODE_ENV === 'test'
      ? []
      : [
          ObserveModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
              return {
                appKey: config.getOrThrow<string>('OBSERVE_APP_KEY'),
                appSecret: config.getOrThrow<string>('OBSERVE_APP_SECRET'),
                serviceId: config.getOrThrow<string>('OBSERVE_SERVICE_ID'),
              };
            },
          }),
        ]),
    DatabaseModule,
    RestaurantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
