import { TUser } from "./redux"

// Поля аутентификации
export type TAuthProperty = {
  logInUser: TUser | null
  isLoaded?: boolean
}

// Тип аутентификации для получения в connect
export type TAuth = {
  auth: TAuthProperty
}

export type TAuthIsLoaded = {
  auth: {
    isLoaded: boolean
  }
}
export type TAuthLogInUser = {
  auth: {
    logInUser: TUser | null
  }
}

export type TLogInUser = {
  logInUser: TUser | null
}

export type TCurrentFilter = {
  filterName: string
  filterTitle: string
}

// Тип фильтра для получения в connect
export type TFilter = {
  filter: TCurrentFilter
}

export type TCommunication = {
  message: string
  loading: boolean
  pasteImage: string
  pathSelectedMedia: string
  previewImage: string | null
  uploadingSelectedFile: boolean
  imageCompress: boolean
  uploadImageProgress: number | null
  isUser: boolean,
  usersOnline: null | Array<TUser>
}