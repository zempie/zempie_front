import { onBeforeRouteLeave } from 'vue-router';

export function useRouterLeave() {

  onBeforeRouteLeave((to, from, next) => {
    colorLog(`[vue] beforerouterleave run in custom router composable: ${useCommon().common.value.isPopState}`, 'skyblue')
    if (useCommon().common.value.isPopState) {
      next(false)
    } else {
      next()
    }
  })

}