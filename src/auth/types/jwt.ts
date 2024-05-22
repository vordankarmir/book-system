export type JWTPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export type JWTTokens = {
  accessToken: string;
  refreshToken: string;
};
