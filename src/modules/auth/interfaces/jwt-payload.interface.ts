import { Role } from '../../../common/enums/role.enum';

export interface JwtAccessPayload {
  sub: string;
  email: string;
  role: Role;
  type: 'access';
}

export interface JwtRefreshPayload {
  sub: string;
  tokenId: string;
  type: 'refresh';
}
