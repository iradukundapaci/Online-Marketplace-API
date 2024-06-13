import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const Seller = () => SetMetadata('roles', [Role.SELLER]);
