<template>
  <div>
    <div class="footer">
      <dl>
        <dt>
          <p>
            <a :href="ftr" target="_blank">{{
              i18n.t('company.info.title')
            }}</a>
          </p>
          <div>
            {{ i18n.t('fromthered') }} &nbsp; | &nbsp;
            {{ i18n.t('company.owner') }} :
            {{ i18n.t('company.owner.name') }} &nbsp; | &nbsp;{{
              i18n.t('company.id')
            }}
            : 178-88-00617<br /><br />

            {{ i18n.t('company.address') }} &nbsp; | &nbsp;
            {{ i18n.t('email') }} :
            <a :href="'mailto:' + email" style="color: #30a6d8"
              >support@fromthered.com</a
            >
            <br />
            Copyright ⓒ Fromthered Inc. All rights reserved.
          </div>
        </dt>
        <dd>
          <a :href="insta" target="_blank" class="insta-icon"
            ><i class="uil uil-instagram"></i
          ></a>
        </dd>
      </dl>
    </div>
    <!-- 하단영역 끝 -->
  </div>
</template>

<script lang="ts" setup>
import { ref, useRoute, onMounted, useContext } from '@nuxtjs/composition-api'
const { i18n } = useContext()
// import i18n from '~/plugins/i18n'

// import useI18n from 'vue-i18n'

// let { t, tc, locale } = new useI18n()
const insta = ''
const ftr = ''
const email = ''

// const proc = process.env;

onMounted(() => {
  // console.log('?', i18n.tc('addGameInfo.game.name'))
  // locale = navigator.language.split('-')[0]
})
</script>

<style scoped lang="scss">
.insta-icon:hover {
  color: #c13584;
}
</style>
