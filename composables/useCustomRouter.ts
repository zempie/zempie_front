import { onBeforeRouteLeave } from 'vue-router';


// /*
//  page 단위에서 isPopState 검사 후 true라면 false로 변경
//  이후 component에서 watch로 받아 팝업닫기
// */
export function useRouterLeave() {
  onBeforeRouteLeave((to, from, next) => {
    colorLog(`[vue] beforerouterleave run in custom router composable: ${useCommon().common.value.isPopState}`, 'skyblue')
    if (useCommon().common.value.isPopState) {
      next(false)
      useCommon().setPopState(false)
      return false
    } else {
      next()
    }
  })
}
