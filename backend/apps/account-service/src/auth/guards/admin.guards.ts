import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthenticatedUser } from "libs/shared/src";
import { UserRole } from "../../users/types/userRole.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as AuthenticatedUser;

    if (user && user.role === UserRole.ADMIN) {
      return true;
    }

    throw new ForbiddenException('Access forbidden');
  }
}