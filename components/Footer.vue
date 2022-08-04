<template>
    <div class="footer">
        <dl>
            <dt>
                <p>
                    <a :href="config.FTR_PAGE_URL" target="_blank">{{ $t('company.info.title') }}</a>
                    <!--            <a href="#">서비스소개</a>-->
                    <NuxtLink to="/terms">{{ $t('terms') }}</NuxtLink>
                    <!--            <a href="#">개인정보처리방침</a>-->
                    <!--            <a href="#">고객센터</a>-->
                </p>
                <div>
                    {{ $t('fromthered') }} &nbsp; | &nbsp; {{ $t('company.owner') }} : {{ $t('company.owner.name') }}
                    &nbsp; |
                    &nbsp;{{ $t('company.id') }} : 178-88-00617
                    <br /><br />

                    <!-- {{ $t('company.address') }} &nbsp; | &nbsp; {{ $t('email') }} :  -->
                    <a :href="'mailto:' + config.SUPPORT_EMAIL" style="color: #30a6d8">
                        {{ config.SUPPORT_EMAIL }}</a><br />
                    Copyright ⓒ Fromthered Inc. All rights reserved.
                </div>
            </dt>
            <!-- social -->
            <dd>
                <a :href="config.ZEMPIE_INSTA_URL" target="_blank" class="insta-icon">
                    <i class="uil uil-instagram"></i>
                </a>
                <a :href="config.ZEMPIE_YOUTUBE_URL" target="_blank" class="youtube-icon">
                    <i class="uil uil-youtube"></i>
                </a>
                <a :href="config.ZEMPIE_FACEBOOK_URL" target="_blank" class="facebook-icon">
                    <i class="uil uil-facebook"></i>
                </a>
            </dd>
            <!-- /social -->
        </dl>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

</script>


<style scoped lang="scss">
.insta-icon:hover {
    color: #C13584;
}

.youtube-icon:hover {
    color: #FF0000;
}

.facebook-icon:hover {
    color: #4267B2;
}
</style>
