import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { MockType } from './mockType';

export const roleGuardMock: () => MockType<JwtRoleGuard> = jest.fn(() => ({
    canActivate: jest.fn().mockImplementation(() => {
        return true;
    })
}))