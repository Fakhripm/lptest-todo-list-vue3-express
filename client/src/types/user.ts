export interface User {
  id: string
  username: String
}

export interface LoginParmas {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: User
}
