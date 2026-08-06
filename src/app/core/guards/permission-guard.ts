import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permission';

export const permissionGuard: CanActivateFn = (route, state) => {
  const perm = inject(PermissionService);
  return perm.checkSensorPermissions();
};
