import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  /**
   * Creates a new instance of the PrismaService class.
   *
   * @param {ConfigService} config - The configuration service used to retrieve the database URL.
   * @return {void}
   */
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
