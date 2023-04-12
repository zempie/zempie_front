
import webViewJavaScriptBridge from "webview-javascript-bridge";

const callHandler = async (handleName, params) => {
  const response = await webViewJavaScriptBridge.sendMessage({
    action: handleName,
    params: params,
  });
  return response;
}

export async function isFlutter() {
  try {
    const response = await callHandler("isFlutter");
    return !!response;
  } catch (error) {
    return false;
  }
}
