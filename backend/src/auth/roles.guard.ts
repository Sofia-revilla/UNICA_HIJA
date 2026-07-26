import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Decorator key definition
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If no roles are annotated, route is open by default
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Appended by NestJS Passport JWT Passport Extraction strategy

    if (!user) {
      return false;
    }

    // Evaluate Role-Based Permission Matrix (RBAC)
    const hasRole = requiredRoles.map(r => r.toUpperCase()).includes(user.role?.toUpperCase());
    console.log(`RBAC Gatekeeper: Authorized client [${user.name}] with active role [${user.role}]: ${hasRole ? 'ACCESS GRANTED' : 'ACCESS DENIED'}`);
    return hasRole;
  }
}
