export type LoginCredentials = {
  email: string
  senha: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
}