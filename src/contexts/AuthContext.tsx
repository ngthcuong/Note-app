import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type User from '../interfaces/User';
import { mockUser } from '../assets/mockData';

interface RegisterData {
  phone: string;
  password: string;
  fullName: string;
  email: string;
  gender: string;
  dob: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: {
    phone: string;
    password: string;
  }) => Promise<ResponseLogin | undefined>;
  register: (userData: RegisterData) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => void;
}

interface ResponseLogin {
  success: boolean;
  message?: string;
  errorCode?: 'WRONG_PHONE' | 'WRONG_PASSWORD' | 'USER_NOT_FOUND';
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
  }): Promise<ResponseLogin | undefined> => {
    try {
      const user = mockUser.find(user => user.phone === userData.phone);
      if (user) {
        const isCorrectPassword = user.password === userData.password;
        if (isCorrectPassword) {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));

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
  const register = (userData: RegisterData): void => {};

  // Đăng xuất
  const logout = (): void => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Cập nhật thông tin user
  const updateUser = (userData: Partial<User>): void => {};

  const changePassword = (oldPassword: string, newPassword: string): void => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
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
