export type TLang = {
  ru: string
  tk: string
}

export type TCommon = {
  id: number
  title: TLang
}

export type TQrResult = {
  d: {
    m: {
      l: string
      p: string
    }
  }
}
