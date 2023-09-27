import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import { MockType } from './mockType';

export const authGuardMock: () => MockType<JwtAuthGuard> = jest.fn(() => ({
    canActivate: jest.fn().mockImplementation(() => {
        return true;
    })
}))