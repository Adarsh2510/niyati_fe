import { RegisterRequest } from '@/types/auth';
import { generateRandomString } from '@/utils/strings';

export const getDemoUserDataForSignUp = (): RegisterRequest => {
  return {
    name: 'Guest User',
    email: `guest-${generateRandomString(10)}@niyatiprep.com`,
    password: 'password@123',
  };
};
