import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000')),
      useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME', 'products');

    this.createBucketIfNotExists();
  }

  private async createBucketIfNotExists() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      this.logger.log(`Bucket '${this.bucketName}' created.`);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuid()}-${file.originalname}`;
    const metaData = { 'Content-Type': file.mimetype };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
    );

    const protocol =
      this.configService.get('MINIO_USE_SSL', 'false') === 'true'
        ? 'https'
        : 'http';
    const fileUrl = `${protocol}://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.bucketName}/${fileName}`;
    return fileUrl;
  }
}
