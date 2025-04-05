import { SetMetadata } from '@nestjs/common';
import { PermissionHandler } from '../../casl/casl.types';
import { CHECK_PERMISSIONS_KEY } from '../../casl/casl.types';

export const CheckPermissions = (callback: (ability: any) => boolean) =>
  SetMetadata(CHECK_PERMISSIONS_KEY, callback);
