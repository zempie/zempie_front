export default function () {
  const callHandler = async (handleName: string, params?: any) => {
    //flutter_inappwebview
    return await callInappWebviewHandler(handleName, params);
  };
  const callInappWebviewHandler = async (handleName: string, params) => {
    //@ts-ignore
    const response = await window.flutter_inappwebview
      .callHandler(handleName, params);
    return response;
  }

  const FlutterBridge = {
    async isFlutter() {
      try {
        const response = await callHandler("isFlutter");
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
      const response = await callHandler("signInGoogle");
      const result = JSON.parse(response);
      return result;

    },
    async signInFacebook() {
      const response = await callHandler("signInFacebook");
      console.log('respon', response)
      const result = JSON.parse(response);
      return result;

    },
    async getFbCurrentUser() {
      const response = await callHandler("currentUser");
      return JSON.parse(response);

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

    async initPurchase(products) {
      // const response = await webViewJavaScriptBridge.sendMessage({
      //   action: "signInGoogle",
      // });
      // const result = JSON.parse(response);
      // return result;
      const response = await callHandler("initPurchase", { products });
      const result = JSON.parse(response);
      return result;
    },
    async purchaseItem(productId: string) {
      // const response = await webViewJavaScriptBridge.sendMessage({
      //   action: "signInGoogle",
      // });
      // const result = JSON.parse(response);
      // return result;
      const response = await callHandler("purchaseItem", { productId });
      const result = JSON.parse(response);
      return result;
    },

    async consumeReceipt(receipt) {
      const response = await callHandler("consumeReceipt", { receipt });
      const result = JSON.parse(response);
      return result;
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
