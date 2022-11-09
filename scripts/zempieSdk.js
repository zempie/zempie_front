export const ZempieSdk = {
  
  event: {},
  isProduction: false,

  useCtrl: function () {
    ZempieSdk.postMessage({ type: '@useCtrl' })
  },

  useLading: function () {
    ZempieSdk.postMessage({ type: '@useLoading' })
  },

  ready: function () {
    ZempieSdk.postMessage({ type: '@gameReady' })
  },

  updateScore: function (score) {
    console.log('score', score)
    ZempieSdk.postMessage({ type: '@updateScore', score })
  },

  gameOver: function (score) {

    ZempieSdk.postMessage({ type: '@gameOver', score })
  },

  postMessage(message) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ event: message }))

    if (window.parent !== window) {
      window.parent.postMessage(message, '*')
    }
  },

  on(event, func) {
    this.event[event] = this.event[event] || []
    this.event[event].push(func)
  },

  off(event, func) {
    this.event[event] = this.event[event] || []
    var idx = this.event[event].indexOf(func)
    if (idx > 0) {
      this.event[event].splice(idx, 1)
    }
  },

  emit(event, arg1, arg2, arg3, arg4, arg5) {
    this.event[event] = this.event[event] || []
    for (var i = 0; i < this.event[event].length; i++) {
      this.event[event][i](arg1, arg2, arg3, arg4, arg5)
    }
  },
}

// window.addEventListener('message', function (message) {
//   var type = message.data.type
//   switch (type) {
//     case '@production': {
//       ZempieSdk.isProduction = true
//       break
//     }

//     case '@gamePlay':
//     case '@gameRetry':
//     case '@gamePause':
//     case '@gameResume':
//     case '@soundOn':
//     case '@soundOff': {
//       ZempieSdk.emit(type)
//       break
//     }
//     case '@adFinished':
//   }
// })

// ZempieSdk.postMessage({ type: '@initSdk' })
// window.ZempieSdk = ZempieSdk
