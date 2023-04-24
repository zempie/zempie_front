<template>
  <ClientOnly>
    <el-dropdown trigger="click" customClass="share-menu">
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
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage } from 'element-plus'
import { Icon } from '@iconify/vue';
import { execCommandCopy } from '~~/scripts/utils';
import { PropType } from 'vue';
import { IFeed } from '~~/types';
import shared from '~~/scripts/shared'
import { openCenteredPopup } from '~~/scripts/ui-utils';
import { useGtag } from 'vue-gtag-next';



const { t, locale } = useI18n()
const config = useRuntimeConfig()
const gtag = useGtag()

const props = defineProps({
  url: String,
  feed: Object as PropType<IFeed>,
  type: String
})

function getImgObj(): { url: string, name: string, size: number, type: string, priority: number } | null {
  if (props.feed.attatchment_files?.length) {
    return props.feed.attatchment_files?.find((file: any) => file.type === 'image');
  } else {
    return null
  }

}

function copyUrl() {
  const url = props.url
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
  const Kakao = window.Kakao

  const imageUrl = getImgObj()?.url || config.OG_IMG
  let linkUrl = props.url ?? window.location.href

  if (!Kakao.isInitialized()) {
    Kakao.init(config.KAKAO_JS_KEY)
  }

  const { title, desc } = shared.getFeedInfo(props.feed)

  gtag.event('click', {
    event_category: 'button',
    event_label: `${social}_share`,
    event_value: 1
  })

  switch (social) {
    case 'kakao':
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${t('share.zempie.title')} ${props.feed.user.nickname} ${t('share.zempie.nickname.title')}`,
          description: desc,
          imageUrl,
          link: {
            mobileWebUrl: linkUrl,
            webUrl: linkUrl,
          },
        },
        buttons: [
          {
            title: '웹으로 이동',
            link: {
              mobileWebUrl: linkUrl,
              webUrl: linkUrl,
            },
          },
          {
            title: '앱으로 이동',
            link: {
              mobileWebUrl: linkUrl,
              webUrl: linkUrl,
            },
          },
        ],
      })
      break;
    case 'facabook':
      const popUrl = `${config.FACEBOOK_SHARE_URL}?app_id=${config.FACEBOOK_APP_ID}&display=popup&href=${linkUrl}&redirect_uri=${linkUrl}`
      openCenteredPopup(popUrl, 'Facabook share', 500, 300)
      break;
    case 'twitter':
      const shareUrl = props.url
      linkUrl = `${config.TWITTER_SHARE_URL}?url=${shareUrl}`
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
