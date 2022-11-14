<template>
  <ClientOnly>
    <div class="footer">
      <dl>
        <dt>
          <p>
            <a
              :href="config.FTR_PAGE_URL"
              target="_blank"
              aria-label="Fromthered website"
              >{{ $t('company.info.title') }}</a
            >
            <NuxtLink :to="$localePath('/terms')">{{ $t('terms') }}</NuxtLink>
            <NuxtLink :to="$localePath('/privacy')" style="color:#f97316">{{ $t('term.private') }}</NuxtLink>
          </p>
          <div>
            {{ $t('fromthered') }} &nbsp; | &nbsp; {{ $t('company.owner') }} :
            {{ $t('company.owner.name') }} &nbsp; | &nbsp;{{
              $t('company.id')
            }}
            : 178-88-00617 <br /><br />

            <!-- {{ $t('company.address') }} &nbsp; | &nbsp; {{ $t('email') }} :  -->
            <a
              :href="'mailto:' + config.SUPPORT_EMAIL"
              style="color: #30a6d8"
              aria-label="Support mail"
            >
              {{ config.SUPPORT_EMAIL }}</a
            ><br />
            ⓒ FROMtheRED Inc. All rights reserved.
          </div>
        </dt>
        <dd>
          <a
            :href="config.ZEMPIE_INSTA_URL"
            target="_blank"
            class="insta-icon"
            aria-label="Zempie instagram"
          >
            <i class="uil uil-instagram"></i>
          </a>
          <a
            :href="config.ZEMPIE_YOUTUBE_URL"
            target="_blank"
            class="youtube-icon"
            aria-label="Zempie youtube"
          >
            <i class="uil uil-youtube"></i>
          </a>
          <a
            :href="config.ZEMPIE_FACEBOOK_URL"
            target="_blank"
            class="facebook-icon"
            aria-label="Zempie facebook"
          >
            <i class="uil uil-facebook"></i>
          </a>
        </dd>
      </dl>
    </div>
  
  </ClientOnly>
</template>

<script setup lang="ts">
const { $localePath } = useNuxtApp()
const config = useRuntimeConfig()
</script>

<style scoped lang="scss">

.insta-icon:hover {
  color: #c13584;
}

.youtube-icon:hover {
  color: #ff0000;
}

.facebook-icon:hover {
  color: #4267b2;
}
</style>
