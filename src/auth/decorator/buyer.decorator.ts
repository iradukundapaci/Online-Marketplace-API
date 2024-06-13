import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const Buyer = () => SetMetadata('roles', [Role.BUYER]);
