import { mockUser } from '../assets/mockData';

interface Response {
  success: boolean;
  message: string;
  errorCode?: 'WRONG_PHONE' | 'WRONG_PASSWORD' | 'USER_NOT_FOUND';
}

const login = async (userData: {
  phone: string;
  password: string;
}): Promise<Response | undefined> => {
  try {
    const user = mockUser.find(user => user.phone === userData.phone);
    if (user) {
      const isCorrectPassword = user.password === userData.password;
      if (isCorrectPassword) {
        return {
          success: true,
          message: 'Đăng nhập thành công',
        };
      } else {
        return {
          success: false,
          message: 'Mật khẩu không chính xác',
          errorCode: 'WRONG_PASSWORD',
        };
      }
    }
    return {
      success: false,
      message: 'Không tìm thấy tài khoản',
      errorCode: 'USER_NOT_FOUND',
    };
  } catch (error) {
    console.error(error);
  }
};

export { login };
