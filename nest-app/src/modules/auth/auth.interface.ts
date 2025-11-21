export type TPayloadJwt = { id: number; username: string };

export interface IResAuth {
  accessToken: string;
  refreshToken: string;
}
