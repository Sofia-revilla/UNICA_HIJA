import { Module, Global } from '@nestjs/common';
import { PatientsController } from './patients/patients.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RedisService } from './common/redis.service';

@Global()
@Module({
  providers: [
    RedisService,
  ],
  exports: [
    RedisService,
  ],
})
export class CommonModule {}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'NH_CRYPTO_KEY_2026_WAH4E_MATRIX',
      signOptions: { expiresIn: '8h' },
    }),
    CommonModule,
  ],
  controllers: [
    PatientsController,
  ],
  providers: [
    // Providers like PrismaService or AuthService would go here in production
  ],
})
export class AppModule {}
