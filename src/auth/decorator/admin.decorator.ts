import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const Admin = () => SetMetadata('roles', [Role.ADMIN]);
