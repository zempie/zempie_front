import { onBeforeRouteLeave } from 'vue-router';

export function useRouterLeave() {

  onBeforeRouteLeave((to, from, next) => {
    colorLog('[vue] beforerouterleave run in custom router composable', 'skyblue')
    if (!useCommon().common.value.isPopState) {
      next()
    } else {
      useCommon().setPopState(false)
    }
  })



}