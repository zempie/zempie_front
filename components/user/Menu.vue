<template>
  <div class="ml10" id="userMenu">
    <el-dropdown trigger="click" ref="userMenu" id="userMenu">
      <UserAvatar style="width: 30px; height: 30px" :user="user" :key="user?.picture" />
      <template #dropdown>
        <div slot="body" class="header-setting" style="min-width: 250px" @click="userMenu?.handleClose()">
          <dl style="margin: 10px 0px 0px 0px">
            <UserAvatar style="width: 30px; height: 30px" :user="user" :key="user?.picture" />
            <dd>
              <NuxtLink :to="$localePath(`/${user?.nickname}`)">
                <h2>{{ user?.nickname }}</h2>
              </NuxtLink>
            </dd>
          </dl>
          <div>
            <h2>{{ $t('myProfile') }}</h2>
            <div>
              <NuxtLink id="myChannel" :to="$localePath(`/${user?.nickname}`)"><i class="uil uil-user"></i>
                {{ $t('myChannel') }}
              </NuxtLink>
              <NuxtLink id="gameStudio" :to="$localePath('/project/list')"><i class="uil uil-robot"></i>
                {{ $t('gameStudio') }}
              </NuxtLink>
            </div>
          </div>
          <div>
            <h2>{{ $t('group') }}</h2>
            <div>
              <NuxtLink :to="$localePath(`/myaccount/communities`)"><i class="uil uil-users-alt"></i>
                {{ $t('joined.group') }}
              </NuxtLink>
            </div>
          </div>
          <div>
            <h2>{{ $t('account') }}</h2>
            <div>
              <NuxtLink :to="$localePath(`/myaccount`)"><i class="uil uil-setting"></i>
                {{ $t('my.account') }}
              </NuxtLink>
            </div>
          </div>
          <p>
            <a class="btn-default w100p" @click="logout">{{
              $t('logout')
            }}</a>
          </p>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang='ts'>
import { ElDropdown } from 'element-plus'
const { $localePath } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const userMenu = ref()

const user = computed(() => useUser().user.value.info)


function logout() {
  if (route.meta.middleware === 'auth' || route.meta.name === 'main') {
    router.replace($localePath('/'))
  }
  useUser().logout()
}
</script>
<style scoped lang='scss'></style>
