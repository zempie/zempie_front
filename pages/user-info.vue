<template>
  <div class="content" style="width:100vw;">
    <h1>User info page</h1>
    <div>
      <p>PINIA</p>
      <template v-if="userStore.$state.user">
        <UserInfo :user="userStore.$state.user">
          <template #addPoint>
            <button @click="addPointToPinia">add point</button>
          </template>
          <template #editProfile>
            <input type="file" accept="image/jpeg, image/png, image/svg, image/jpg, image/webp, image/bmp,"
              @change="updateProfileToPinia" />
          </template>
        </UserInfo>
      </template>

      <p>useState</p>
      <UserInfo :user="user">
        <template #addPoint>
          <button @click="addPointToState">add point</button>
        </template>
        <template #editProfile>
          <input type="file" accept="image/jpeg, image/png, image/svg, image/jpg, image/webp, image/bmp,"
            @change="updateProfileToState" />
        </template>
      </UserInfo>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'


definePageMeta({
  requiresAuth: true,
  middleware: ["auth"]
});

const userStore = useUserStore();
const { user, setProfileImg } = useUser();


function addPointToPinia() {
  userStore.$state.user.point += 10;
}

function addPointToState() {
  const info: any = user
  info.value.point += 10;
}

function updateProfileToPinia(event: any) {

  const reader = new FileReader();
  reader.onload = e => {

    //pinia
    userStore.$state.user.profile_img = e.target!.result as string
  };
  reader.readAsDataURL(event.target.files[0]);

}


function updateProfileToState(event: any) {
  const reader = new FileReader();
  reader.onload = e => {

    // useState
    setProfileImg(e.target!.result as string)


  };
  reader.readAsDataURL(event.target.files[0]);

}

</script>
<style scoped lang="scss">
.content {
  height: calc(100vh - 100px);
}
</style>