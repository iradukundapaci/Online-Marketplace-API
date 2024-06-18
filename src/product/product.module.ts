import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
