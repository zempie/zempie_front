
import webViewJavaScriptBridge from "webview-javascript-bridge";


export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      webViewJavaScriptBridge
    }
  }
})
