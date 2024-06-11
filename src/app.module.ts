import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    OrderModule,
    CategoryModule,
    ReviewModule,
    UserModule,
  ],
})
export class AppModule {}
