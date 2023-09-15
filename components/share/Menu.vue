<template>
  <ClientOnly>
    <el-dropdown ref="shareMenu" trigger="click" class="share-menu" @visible-change="handleVisible">
      <a class="pointer">
        <i>
          <LazyIconShare />
        </i></a>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="webShare" id="mobileShareBtn">
            <Icon icon="ri-links-line" class="icon" />
            <span class="text">{{ $t('mobile.share') }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click="copyUrl">
            <Icon icon="ri-links-line" class="icon" id="linkShareBtn" />
            <span class="text">{{ $t('share.link.url') }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click="shareSocial('kakao')" id="kakaoShareBtn">
            <Icon icon="ri:kakao-talk-fill" class="icon" />
            <span class="text">{{ $t('share.link.kakao') }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click="shareSocial('twitter')" id="twitterShareBtn">
            <Icon icon="ri-twitter-fill" class="icon" />
            <span class="text">{{ $t('share.link.twitter') }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click="shareSocial('facabook')" id="facebookShareBtn">
            <Icon icon="ri-facebook-circle-fill" class="icon" />
            <span class="text"> {{ $t('share.link.facabook') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </ClientOnly>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage } from 'element-plus'
import { Icon } from '@iconify/vue';
import { execCommandCopy } from '~~/scripts/utils';
import { openCenteredPopup } from '~~/scripts/ui-utils';
import { useGtag } from 'vue-gtag-next';
import { IUser } from '~~/types';
import flutterBridge from '~~/scripts/flutterBridge';

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const gtag = useGtag()


interface IShareInfo {
  img_url: string,
  title: string,
  desc: string,
  user: IUser,
  url: string
}

const props = defineProps({
  url: String,
  type: String,
  shareInfo: Object as PropType<IShareInfo>
})

const shareMenu = ref()
const isMobile = computed(() => useCommon().common.value.isMobile)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)
const platform = computed(() => useMobile().mobile.value.platform)

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      shareMenu.value.handleClose()
    }
  })

const title = computed(() => {
  switch (props.type) {
    case 'game':
      return `${props.shareInfo.user.nickname}${t('seo.channel.games.title')}`
    default:
      return `${props.shareInfo.user.nickname} ${t('seo.feed.title')} `
  }

})

onMounted(() => {
  // page에서 작동을 안해서 임시 추가
  useRouterLeave()

})

function copyUrl() {
  const url = props.shareInfo.url
  execCommandCopy(url)
  ElMessage({
    message: t('copied.clipboard'),
    type: 'success',
    customClass: 'copy-msg',
  })

  gtag.event('click', {
    event_category: 'button',
    event_label: `url_share`,
    event_value: 1
  })
}

function shareSocial(social: string) {

  const imageUrl = props.shareInfo.img_url || config.OG_IMG

  let linkUrl = props.shareInfo.url ?? window.location.href

  const { desc } = props.shareInfo

  gtag.event('click', {
    event_category: 'button',
    event_label: `${social} _share`,
    event_value: 1
  })

  switch (social) {
    case 'kakao':
      const Kakao = window.Kakao
      if (!Kakao.isInitialized()) {
        Kakao.init(config.KAKAO_JS_KEY)
      }
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title.value,
          description: desc,
          imageUrl,
          link: {
            mobileWebUrl: linkUrl,
            webUrl: linkUrl,
          },
        },
        buttons: [
          {
            title: t('goto.web'),
            link: {
              mobileWebUrl: linkUrl,
              webUrl: linkUrl,
            },
          },
        ],
      })
      break;
    case 'facabook':
      const popUrl = `${config.FACEBOOK_SHARE_URL}?app_id=${config.FACEBOOK_APP_ID}&display=popup&href=${linkUrl}&redirect_uri=${linkUrl} `
      openCenteredPopup(popUrl, 'Facabook share', 500, 300)
      break;
    case 'twitter':
      const shareUrl = props.shareInfo.url
      linkUrl = `${config.TWITTER_SHARE_URL}?url=${shareUrl} `
      openCenteredPopup(linkUrl, 'Twitter share', 500, 300)
      break;
  }

}

function handleVisible(visible: boolean) {
  if (!isMobile.value) return
  if (visible) {
    useCommon().setPopState(true)
  } else {
    useCommon().setPopState(false)
  }
}

async function webShare() {

  if (isFlutter.value && platform.value.toLocaleLowerCase() === 'android') {
    flutterBridge().shareClick(props.shareInfo)
  } else {
    const shareData = {
      title: props.shareInfo.title,
      text: props.shareInfo.desc,
      url: props.shareInfo.url,
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
    }
  }
}
</script>
<style scoped lang="scss">
.icon {
  width: 18px;
  height: 18px;
}

.text {
  margin-left: 10px;
}
</style>
