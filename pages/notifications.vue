<template>
  <div class="content">
    <div class="noti-visual-title">
      <h1>
        Notifications
      </h1>
    </div>
    <!-- DM 리스트 -->
    <div v-if="useAlarm().alarm.value.newNoti" class="noti-toast"
    ><p >{{ t('new.msg') }}  {{ t('need.refresh') }}&nbsp;<i class="uil uil-sync"></i></p>
      </div>
    <div class="dm-list"
    :style="useAlarm().alarm.value.newNoti ? 'border-top-left-radius: 0;border-top-right-radius: 0;' :  'border-top-left-radius: 10px;border-top-right-radius: 10px;'"
    >
      
      <div class="dl-title">
        <div>
          <!-- <h2>Notifications</h2>
          <p>프로필 사진은 Zempie가 제공하는 커뮤니티를 나타내는 위치에 표시됩니다.</p> -->
        </div>
        <p>
          <a @click="readAll"><i class="uil uil-comment-alt"></i> <em> {{ t('mark.all') }} </em></a>
          <NuxtLink :to="$localePath(`/myaccount`)"><i class="uil uil-setting"></i> <em>{{ t('setting') }}</em></NuxtLink>
        </p>
      </div>

      <dl class="dl-content">
          <!-- <div>
            <div class="input-search-default">
              <p><i class="uil uil-search"></i></p>
              <div><input type="text" name="" title="keywords" placeholder="검색어를 입력하세요." /></div>
            </div>
          </div> -->
          <ul ref="listEl">
            <TransitionGroup name="list">
              <li  v-for="noti in list" :key="noti.id" :class="!noti.is_read &&'is-read-active'" @click.stop="clickNoti(noti)">
                <dl>
                  <dd>
                    <UserAvatar :tag="'p'" :user="noti.user" :hasRouter="true"/>
                  </dd>
                  <dt>
                    <h3><span @click.stop="$router.push($localePath(`/channel/${noti.user.channel_id}`))">{{noti.user.name}}&nbsp;</span>{{shared.notiText(noti.type)}}</h3>

                    <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> {{dateFormat(noti.created_at)}}</h4>
                    <p>{{noti.content}}</p>
                  </dt>
                </dl>
              </li>
                
              <BeatLoader v-if="isLoading" :color="'#ff6e17'" size="20px" />
            </TransitionGroup>
            <li v-if="(!isLoading && !list.length)">
                <dl>{{ t('no.alarm') }}</dl>
              </li>
          </ul>
      
      </dl>
    </div>
    <!-- DM 리스트 끝 -->
      

  </div>
</template>
<script setup lang="ts">
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { INotification, eNotificationType } from '~~/types';
import { useInfiniteScroll } from '@vueuse/core'
import { dateFormat } from '~/scripts/utils'
import shared from '~~/scripts/shared';
import { localePath } from 'vue-i18n-routing';

const { $localePath } = useNuxtApp()
const router = useRouter()
const { t, locale } = useI18n()

const NOTI_LIMIT = 10

const list = ref<INotification[]>([])
const limit = ref(NOTI_LIMIT)
const offset = ref(0)
const isAddData = ref(false)
const listEl = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const readCount = ref()

const newNoti = ref(useAlarm().alarm.value.newNoti)


useInfiniteScroll(
    listEl,
    async () => {
    if (isAddData.value && !isLoading.value) {
      offset.value += limit.value
      await fetch()
    }
  },
  { distance: 10 }
)

onMounted(async ()=>{
  await fetch()
})

async function fetch(){
  isLoading.value = true
  const response = await useCustomFetch<{read_count: number, result:INotification[]}>(createQueryUrl('/notification', {limit:limit.value, offset:offset.value}), getComFetchOptions('get', true))
  const { result, read_count }  = response
  readCount.value = read_count < 99 ? '99+' : read_count

  if ( result ) {
    if ( isAddData.value ) {
      if (result.length > 0) {
        list.value = [...list.value, ...result]
      } else {
        isAddData.value = false
      }
    } else {
      list.value = [...list.value, ...result]
      isAddData.value = true
    }
  }
  isLoading.value = false
}

async function clickNoti(noti:INotification){
  await shared.commonTryCatch( async () =>{ return await useCustomFetch('/notification', getComFetchOptions('put', true, {id:noti.id}))})
  .then(()=>{
     shared.moveNoti(noti)
  })
}



async function readAll(){
  await shared.commonTryCatch( async() => { return await useCustomFetch('/notification/read-all', getComFetchOptions('put', true))})
  .then(()=>{
    list.value.map((noti)=>{
      return noti.is_read = true
    })
  })
   
}


</script>
<style scoped lang="scss">

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.noti-visual-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1200px;
  height: 150px;
  margin: 0 auto;
  margin-bottom: 30px;
  border-radius: 15px;
  background: url('/images/alarm_banner.png');
  background-size: cover;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  h1 {
    font-weight: 600;
    font-size: 30px;
    line-height: 30px;
    color: #fff;
    
  }
}
.noti-toast{
  width: 1200px;
  height: 50px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  background: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin:0 auto;


}
.dm-list{
  .dl-title{
    p{
      padding-top:30px;
      a{
        &:hover{
          cursor: pointer;
        }
      }
    }
  }
  .dl-content{
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 30px;
    overflow: hidden;
    ul{
      width: 100%;
      height: 650px;
      padding: 10px 5px;
      overflow: auto;
      li{
        margin: 10px 0px;
        padding: 20px 13px 20px 20px;
        background-color: #fff;
        border: 1px solid #f1f1f1;
        border-radius: 10px;
        transition: all 0.4s ease-in-out;
        cursor: pointer;
        &.is-read-active{

          border-left: 3px solid #ff6e17;
        }
        
        &:hover {
        background-color: #f1f1f1;
        }
        &.active {
        background-color: #f1f1f1;
        }
        dl{
          display: flex;
          align-items: center;
          width: 100%;
          dd{
            margin-right:20px;
            p{
              width: 50px;
              height: 50px;
              border-radius: 50%;
              text-align: center;
              font-weight: 500;
              font-size: 16px;
              line-height: 50px;
              color: #ff6e17;
              background: rgba(249, 115, 22, 0.15);
              border: 2px solid #fff;
              box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.06);
            }
            h4{
              margin-bottom: 5px;
              font-size: 16px;  
            }
            span {
              padding: 3px 8.5px;
              color: #fff;
              border-radius: 30px;
              background-color: #ff6e17;
            }
          }
          dt{
            h3 {
              width: 100%;
              font-weight: 500;
              font-size: 16px;
              line-height: 16px;
              color: #333;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              span{
                &:hover{
                  color:#ff6e17
                }
              }
            }
          }
        }
      }
    }

  }
}
@media all and (max-width: 479px) {
  .noti-visual-title {
    width: 100%;
    height: 120px;
  }

  .noti-toast{
    width: 90%;
    margin: 0px auto;
    p{
      width:100%;
    }
  }
  .dm-list{   
    margin: 0px auto;
  }

}

@media all and (min-width: 480px) and (max-width: 767px) {
  .noti-visual-title {
    width: 470px;
    height: 120px;
  }

  .noti-toast{
    width: 470px;
    p{
      width:100%;
    }
  }
  .dm-list{   
    padding-top: 0px;
  }

}

@media all and (min-width: 768px) and (max-width: 991px) {
  .noti-visual-title {
    width: 750px;
  }

  .noti-toast{
    width: 750px;
    p{
      width:100%;
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .noti-visual-title {
    width: 970px;
  }

  .noti-toast{
    width: 970px;
    p{
      width:100%;
    }
  }
}
@media all and (min-width: 1200px) {}

</style>