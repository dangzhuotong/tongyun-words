// tongyun: 自定义静态图片 provider，为相对路径图片拼接应用 baseURL，绝对 URL 原样返回
import { defineProvider } from '@nuxt/image/runtime'
import { hasProtocol, joinURL } from 'ufo'

export default defineProvider({
  getImage(src: string, _opts: any, ctx: any) {
    if (!src || hasProtocol(src, { acceptRelative: true })) {
      return { url: src }
    }
    return {
      url: joinURL(ctx.options.nuxt.baseURL, src),
    }
  },
})
