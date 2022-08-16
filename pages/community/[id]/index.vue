<template>
  <NuxtLayout name="community">
    <ClientOnly>
      <div>
        <dl class="three-area" v-if="isPending">
          <CommunityChannelListSk />
          <dd>
            <TimelineSk />
          </dd>
          <CommunityAboutSk />
        </dl>
        <dl class="three-area" v-else>
          <CommunityChannelList :community="communityInfo" />
          <dd>
            <!-- <TimelineSk /> -->
            <PostTimeline type="community" :ableToPost="communityInfo?.is_subscribed">
              <template #inputBox>
                <input type="text" :placeholder="$t('postModalInput')" readonly
                  @click="communityInfo?.is_subscribed ? '' : needSubscribe = true" />
              </template>
            </PostTimeline>
          </dd>
          <dt>
            <div class="ta-about">
              <h2>About Us</h2>
              <div>
                {{ communityInfo?.description }}
              </div>
              <dl>
                <dt>Created</dt>
                <dd> {{ createdDate }}</dd>
              </dl>
            </div>
            <div class="ta-groups">
              <h2>Group</h2>
              <CommunityList :communities="communities" />
            </div>
          </dt>
        </dl>
      </div>

      <el-dialog v-model="needSubscribe" append-to-body custom-class="modal-area-type">
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ $t('information') }}</dt>
            <dd>
              <button @click="needSubscribe = false"><i class="uil uil-times"></i></button>
            </dd>
          </dl>
          <div class="ma-content">
            <h2>{{ $t('community.subscribe.text1') }} <br />{{ $t('community.subscribe.text2') }} </h2>
            <div>
              <button class="btn-default w48p" @click="subscribe">{{ $t('yes') }}</button>
              <button class="btn-gray w48p" @click="needSubscribe = false">{{ $t('no') }}</button>
            </div>
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
  </NuxtLayout>

</template>
<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElSelect, ElOption, ElMessage, ElDialog } from "element-plus";
import { dateFormat } from '~/scripts/utils'

const route = useRoute()
const router = useRouter()
const $nuxt = useNuxtApp()

const communityInfo = computed(() => useCommunity().community.value.info)
const createdDate = computed(() => dateFormat(useCommunity().community.value.info?.createdAt));

const communities = ref([])
const isPending = ref(true)
const needSubscribe = ref(false)

const communityId = computed(() => route.params.id as string)

console.log($nuxt)

onMounted(async () => {
  await fetch()
})

async function fetch() {

  const { data, pending } = await community.list({ limit: 6, offset: 0 });
  isPending.value = pending.value
  if (data.value) {
    communities.value = data.value?.filter((elem) => {
      return elem.id !== communityId.value
    })
  }
}

async function subscribe() {
  const { data, error } = await community.subscribe(communityId.value)

  if (!error.value) {
    useCommunity().setSubscribe()
    needSubscribe.value = false;
  } else {
    // ElMessage({
    //   message: error.value,
    //   type: 'error'
    // })
  }

}

</script>    


<style scoped lang="scss">
</style>
