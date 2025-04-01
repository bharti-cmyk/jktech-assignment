import { SetMetadata } from '@nestjs/common';
import { PermissionHandler } from '../../casl/casl.types';
import { CHECK_PERMISSIONS_KEY } from '../../casl/casl.types';

export const CheckPermissions = (...handlers: PermissionHandler[]) =>
  SetMetadata(CHECK_PERMISSIONS_KEY, handlers);
