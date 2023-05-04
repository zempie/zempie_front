import { ElMessage } from "element-plus";

export default function () {

  const nuxtApp = useNuxtApp()
  const { t, locale } = useI18n()

  const callHandler = async (handleName, params?: any) => {
    //flutter_inappwebview
    return await callInappWebviewHandler(handleName, params);
  };
  const callInappWebviewHandler = async (handleName, params) => {
    //@ts-ignore
    const response = await window.flutter_inappwebview
      .callHandler(handleName, params);
    return response;
  }

  const FlutterBridge = {
    async isFlutter() {

      try {
        const response = await callHandler("isFlutter");
        alert(`isFlutter: ${response}`)

        return !!response;
      } catch (error) {
        return false;
      }
    },
    async signOutGoogle() {
      const response = await callHandler("signOutGoogle");
      const result = response;
      return result;
    },
    async signInGoogle() {
      alert(`signInGoogle`)
      try {
        const response = await callHandler("signInGoogle");
        const result = JSON.parse(response);
        alert(`response: ${response}`)
        alert(JSON.parse(response))
        return result;
        return result;
      } catch (err) {
        if (err.message.includes('auth/account-exists-with-different-credential')) {
          ElMessage.error(`${t('exist.wt.diff.email')}`)
        }

        alert(JSON.parse(err))
      }
    },
    async signInFacebook() {
      try {
        const response = await callHandler("signInFacebook");
        const result = JSON.parse(response);
        alert(`response: ${response}`)
        alert(JSON.parse(response))
        return result;
      } catch (err) {
        if (err.message.includes('auth/account-exists-with-different-credential')) {
          ElMessage.error(`${t('exist.wt.diff.email')}`)
        }

        alert(JSON.parse(err))
      }
    },
    async getFbCurrentUser() {
      const response = await callHandler("currentUser");

      const result = JSON.parse(response);
      return result;
    },
    async signInApple() {
      const response = await callHandler("signInApple");
      const result = JSON.parse(response);
      return result;
    },

    async flutterLog(logStr) {
      const response = await callHandler("webLog", logStr);
      const result = JSON.parse(response);
      return result;
    },
    async getFlutterPushToken() {
      const result = await callHandler("getMessagingToken");
      return result;
    },
    async signInEmail(params: { email: string, password: string }) {
      const response = await callHandler('signInEmail', params)
      return JSON.parse(response)
    },
    async signOutFirebase() {
      return await callHandler('signOutFirebase')
    },
    async getMessagingToken() {
      return await callHandler('getMessagingToken')
    },
    async windowOpen(url) {
      // const response = await webViewJavaScriptBridge.sendMessage({
      //   action: "windowOpen",
      //   params: {
      //     url,
      //   },
      // });
      // const result = JSON.parse(response);
      // return result;
      const response = await callHandler("windowOpen", { url });
      const result = JSON.parse(response);
      return result;
    },
    async openFile(options?: { type: string, multiple: boolean }) {
      const response = await callHandler("openFile", options);
      return response;
    }

  };

  return FlutterBridge

}
