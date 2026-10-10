export type AppEnv = {
  Variables: {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      role: string;
      className?: string | null;
      [key: string]: any;
    };
    session: {
      id: string;
      userId: string;
      token: string;
      expiresAt: Date;
      [key: string]: any;
    };
  };
};
