<template>
  <ClientOnly>
    <el-dropdown trigger="click" class="share-menu">
      <a class="pointer"><i class="uil uil-share-alt" style="font-size: 20px"></i></a>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="copyUrl">
            <Icon icon="ri-links-line" class="icon" />
            <span class="text">{{ $t('share.link.url') }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click="shareSocial('kakao')">
            <Icon icon="ri:kakao-talk-fill" class="icon" />
            <span class="text">{{ $t('share.link.kakao') }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click="shareSocial('twitter')">
            <Icon icon="ri-twitter-fill" class="icon" />
            <span class="text">{{ $t('share.link.twitter') }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click="shareSocial('facabook')">
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


const title = computed(() => {
  switch (props.type) {
    case 'game':
      return `${props.shareInfo.user.nickname}${t('seo.channel.games.title')}`
    default:
      return `${props.shareInfo.user.nickname} ${t('seo.feed.title')} `
  }

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
