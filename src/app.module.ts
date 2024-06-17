import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { SearchModule } from './search/search.module';
import { KafkaModule } from './kafka/kafka.module';
import { MinioModule } from './minio/minio.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProductModule,
    OrderModule,
    CategoryModule,
    ReviewModule,
    UserModule,
    PrismaModule,
    MailerModule,
    SearchModule,
    KafkaModule,
    MinioModule,
    PaymentModule,
  ],
})
export class AppModule {}
