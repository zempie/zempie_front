export default function () {

  const nuxtApp = useNuxtApp()

  /**
   * Flutter Webview <-> Javascirpt Bridge by CCM
  ​
  */
  const callHandler = async (handleName, params?: any) => {
    //flutter_inappwebview
    return await callInappWebviewHandler(handleName, params);


    //flutter_webview
    //return await callwebviewHandler(handleName,params);
  };
  const callInappWebviewHandler = async (handleName, params) => {
    //@ts-ignore
    const response = await window.flutter_inappwebview
      .callHandler(handleName, params);
    return response;
  }

  const callwebviewHandler = async (handleName, params) => {
    const response = await nuxtApp.$webViewJavaScriptBridge.sendMessage({
      action: handleName,
      params: params,
    });
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
      // const response = await webViewJavaScriptBridge.sendMessage({
      //   action: "signOutGoogle",
      // });
      // const result = response;
      // return result;
      const response = await callHandler("signOutGoogle");
      const result = response;
      return result;
    },
    async signInGoogle() {
      // const response = await webViewJavaScriptBridge.sendMessage({
      //   action: "signInGoogle",
      // });
      // const result = JSON.parse(response);
      // return result;
      const response = await callHandler("signInGoogle");
      const result = JSON.parse(response);
      return result;
    },
    async signInFacebook() {
      const response = await callHandler("signInFacebook");
      const result = JSON.parse(response);
      return result;
    },
    async signInApple() {
      // const response = await webViewJavaScriptBridge.sendMessage({
      //   action: "signInGoogle",
      // });
      // const result = JSON.parse(response);
      // return result;
      const response = await callHandler("signInApple");
      const result = JSON.parse(response);
      return result;
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
    async purchaseItem(productId) {
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

    async flutterLog(logStr) {
      const response = await callHandler("webLog", logStr);
      const result = JSON.parse(response);
      return result;
    },
    async getFlutterPushToken() {
      const result = await callHandler("getMessagingToken");
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

  // export default FlutterBridge;

  return {
    FlutterBridge
  }
}
