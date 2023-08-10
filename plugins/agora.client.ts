
import AgoraRTC from "agora-rtc-sdk-ng"


export default defineNuxtPlugin(() => {
  return {
    provide: {
      AgoraRTC
    }
  }
})
