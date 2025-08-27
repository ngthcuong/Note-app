import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type User from '../interfaces/User';
import { mockUser } from '../assets/mockData';
import bcrypt from 'bcryptjs';

interface RegisterData {
  id?: string;
  phone: string;
  password: string;
  fullName: string;
  email: string;
  gender: string;
  dob: Date;
}

interface Response {
  success: boolean;
  message?: string;
  errorCode?:
    | 'WRONG_PHONE'
    | 'WRONG_PASSWORD'
    | 'USER_NOT_FOUND'
    | 'USER_EXIST';
  user?: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: {
    phone: string;
    password: string;
  }) => Promise<Response | undefined>;
  register: (userData: RegisterData) => Promise<Response | undefined>;
  confirmUser: (password: string) => Promise<Response | undefined>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<Response | undefined>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<Response | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Đăng nhập
  const login = async (userData: {
    phone: string;
    password: string;
  }): Promise<Response | undefined> => {
    try {
      const user = mockUser.find(user => user.phone === userData.phone);
      if (user) {
        const isCorrectPassword = await bcrypt.compare(
          userData.password,
          user.password || ''
        );
        if (isCorrectPassword) {
          const { password, ...userWithoutPassword } = user;
          setUser(user);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));

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

  // Đăng ký
  const register = async (
    userData: RegisterData
  ): Promise<Response | undefined> => {
    try {
      setIsLoading(true);
      if (userData) {
        const isExist = mockUser.find(user => userData.phone === user.phone);
        if (isExist) {
          return {
            success: false,
            message: 'Số điện thoại này đã được đăng ký',
            errorCode: 'USER_EXIST',
          };
        }

        const userId: string = crypto.randomUUID();
        const hashPassword = await bcrypt.hash(userData.password, 12);
        userData.password = hashPassword;
        mockUser.push({ ...userData, id: userId });

        return {
          success: true,
          message: 'Đăng ký tài khoản thành công',
          user: { ...userData, id: userId },
        };
      } else {
        return {
          success: false,
          message: 'Không thể đăng ký tài khoản',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi đăng ký',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Xác thực người dùng
  const confirmUser = async (
    password: string
  ): Promise<Response | undefined> => {
    try {
      if (!user) {
        return {
          success: false,
          message: 'Không tìm thấy người dùng',
          errorCode: 'USER_NOT_FOUND',
        };
      }

      const userWithPassword = mockUser.find(u => u.id === user.id);
      if (!userWithPassword) {
        return {
          success: false,
          message: 'Không tìm thấy người dùng',
          errorCode: 'USER_NOT_FOUND',
        };
      }

      const isCorrectPassword = await bcrypt.compare(
        password,
        userWithPassword.password || ''
      );

      if (isCorrectPassword) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          message: 'Mật khẩu không chính xác',
          errorCode: 'WRONG_PASSWORD',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi xác thực người dùng',
      };
    }
  };

  // Đăng xuất
  const logout = (): void => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Cập nhật thông tin user
  const updateUser = async (
    userData: Partial<User>
  ): Promise<Response | undefined> => {
    try {
      setIsLoading(true);

      if (!user) {
        return {
          success: false,
          message: 'Không tìm thấy người dùng',
          errorCode: 'USER_NOT_FOUND',
        };
      }

      const updatedUser = { ...user, ...userData };
      const userIndex = mockUser.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUser[userIndex] = updatedUser;
        const { password, ...userWithoutPassword } = updatedUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));

        return {
          success: true,
          message: 'Cập nhật thông tin thành công',
          user: userWithoutPassword,
        };
      }

      return {
        success: false,
        message: 'Không thể cập nhật thông tin',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi cập nhật thông tin',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Thay đổi mật khẩu
  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<Response | undefined> => {
    try {
      setIsLoading(true);

      if (!user) {
        return {
          success: false,
          message: 'Không tìm thấy người dùng',
          errorCode: 'USER_NOT_FOUND',
        };
      }
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const updatedUser = { ...user, password: hashedPassword };
      const userIndex = mockUser.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        const isCorrectPassword = await bcrypt.compare(
          oldPassword,
          mockUser[userIndex].password || ''
        );
        if (isCorrectPassword) {
          mockUser[userIndex] = updatedUser;
          const { password, ...userWithoutPassword } = updatedUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));

          return {
            success: true,
            message: 'Thay đổi mật khẩu thành công',
            user: userWithoutPassword,
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
        message: 'Thay đổi mật khẩu thất bại',
        success: false,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Thay đổi mật khẩu thất bại',
        success: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        confirmUser,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
export default AuthContext;
