<template>
  <div class="content">
    <div class="purchase-container">
      <div class="top flex content-center items-center">
        <h3>{{ $t('hi') }}, <span class="zem-color"> {{ user?.nickname }}({{ user?.name }})</span>{{
          $t('share.zempie.nickname.title') }}!</h3>
      </div>
      <div class="coin-menu">
        <p class="my-info flex items-center justify-between">
          <span>ZEM {{ $t('charge') }}</span>
          <span>{{ $t('my') }} ZEM
            <Coin :coin="user?.coin?.zem" />
          </span>
        </p>
        <div class="card-container row">
          <CoinCard v-for="coin in coins" :coin="coin" :key="coin?.id" :isActive="activeCoin?.id === coin?.id"
            @activate="activateCoin(coin)" />
        </div>
      </div>
      <div class="bottom row flex items-center justify-between">
        <h3><span class="zem-color">{{ activeCoin?.price }}{{ $t('won') }}</span>{{ $t('inform1') }} <span
            class="zem-color"> {{
              activeCoin?.zem
            }}ZEM</span>{{ $t('inform.charge') }}</h3>
        <button class="btn-default" @click="purchaseCoin">₩{{ activeCoin?.price }} {{ $t('pay') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Bootpay from '~~/scripts/bootpay'
import flutterBridge from '~~/scripts/flutterBridge'

const router = useRouter()
const { $localePath } = useNuxtApp()

const user = computed(() => useUser().user.value.info)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)


definePageMeta({
  // middleware: 'auth',
})


onMounted(() => {
  window.addEventListener("message", receiveMessage, false);
})

onBeforeUnmount(() => {
  window.removeEventListener("message", receiveMessage, false);
})

const { data: coinData, error } = await useCustomAsyncFetch<{ result: any }>('/items', getZempieFetchOptions('get', true))
const activeCoin = ref()

const coins = computed(() => {
  const coin = coinData.value?.result?.refitems.map((item) => {
    return {
      id: item.id,
      name: item.name,
      zem: item.quantity,
      img: `/images/coins/${item.img}.png`
    }
  })
  let result = coinData.value?.result.shipitems.map((item) => {
    const refItem = coin.find(({ id }) => id === item.refitem_id)
    return {
      ...refItem,
      price: item.price,
      store_code: item.store_code
    }
  })

  activeCoin.value = result && result[0]

  if (isFlutter.value) {
    flutterBridge().initPurchase(result)
      .then((res) => {
        result = res
      })
  }

  return result
})

function activateCoin(coin) {
  activeCoin.value = coin
}

const receipt_check = ref()
const postMsg = ref()


async function receiveMessage(message: any) {
  postMsg.value = message.data
  if (message.data) {
    const { type, receipt } = JSON.parse(message.data)
    switch (type) {
      case 'purchasing_success':
        receipt_check.value = receipt
        const { data, error } = await useCustomAsyncFetch<{
          result: {
            data: {
              receipt_url: string,
              update: {
                user: { coin: { before_zem: number, zem: number, pie: number } },
                message: string
              },
              receipt: any
            }
          }
        }>('/payment/iap', getZempieFetchOptions('post', true, { receipt: receipt.receipt }))

        await flutterBridge().webLog(data.value)


        try {
          const receipt = data.value.result.data.receipt
          const result = await flutterBridge().consumeReceipt(receipt)

          if (result) {
            const { update } = data.value.result?.data

            useUser().updateUserCoin(update.user.coin)
            useCoin().setCoinReceipt({
              order_id: receipt_check.value.orderId,
              price: activeCoin.value.price,
              metadata: {
                item_name: activeCoin.value.zem + 'ZEM'
              }
            })
            router.push($localePath('/coin/purchase-done'))
          }
        } catch (err) {
          alert(err)
        }

        break;
    }
  }
}

async function purchaseCoin() {

  if (user.value) {
    if (isFlutter.value) {
      const result = await flutterBridge().purchaseItem(activeCoin.value.store_code)
    } else {
      const payload = {
        price: activeCoin.value.price,
        name: activeCoin.value.zem + 'ZEM',
        user_id: String(user.value.id),
        username: user.value.name,
        user_email: user.value.email,
        item_id: activeCoin.value.id,
        qty: 1,
      };

      try {
        const response = await (await Bootpay()).requestPay(payload)
        switch (response.event) {

          case 'done':
            const bpData = {
              receipt: response.data
            }

            const { data, error } = await useCustomAsyncFetch<{
              result: {
                data: {
                  receipt_url: string,
                  update: {
                    user: { coin: { before_zem: number, zem: number, pie: number } },
                    message: string
                  }
                }
              }
            }>('/payment/web', getZempieFetchOptions('post', true, bpData))

            if (data.value.result?.data) {
              const { update } = data.value.result?.data
              useUser().updateUserCoin(update.user.coin)
              useCoin().setCoinReceipt(response.data)
              router.push($localePath('/coin/purchase-done'))

            }
            break;


        }
      } catch (e) {
        // 결제 진행중 오류 발생
        // e.error_code - 부트페이 오류 코드
        // e.pg_error_code - PG 오류 코드
        // e.message - 오류 내용
        console.log(e.message)
        switch (e.event) {
          case 'cancel':
            // 사용자가 결제창을 닫을때 호출
            console.log(e.message);
            break
          case 'error':
            // 결제 승인 중 오류 발생시 호출
            console.log(e.error_code);
            break
        }
      }
    }
  }

}

</script>
<style scoped lang="scss">
.purchase-container {
  margin: 30px auto 10px auto;
  width: 1200px;
  border-radius: 10px;
  background-color: #fff;
  flex-direction: column;


  .top {
    height: 80px;
    border-bottom: 1px solid #bbb;
    padding: 50px;

    h3 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .bottom {
    height: 80px;
    padding: 50px;


    h3 {
      font-size: 20px;
      font-weight: 600;
    }

    .btn-default {
      border-radius: 10px !important;
      width: 30%;
    }
  }

  .coin-menu {
    padding: 50px;
    border-bottom: 1px solid #bbb;

    .my-info {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 40px;
    }

    .card-container {
      flex-wrap: wrap;
    }
  }
}



@media all and (max-width: 479px) {
  .purchase-container {

    width: 100%;
    max-width: 478px;

    .bottom {
      flex-direction: column;
      padding: 20px;
      height: 100px;

      .btn-default {
        width: 100%;
        margin-top: 10px
      }
    }

  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .purchase-container {
    width: 100%;
    max-width: 766px;

    .bottom {
      flex-direction: column;
      padding: 20px;
      height: 100px;

      .btn-default {
        width: 100%;
        margin-top: 10px
      }
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {

  .purchase-container {
    width: 100%;
    max-width: 990px;

  }
}


@media all and (min-width: 992px) and (max-width: 1199px) {

  .purchase-container {
    width: 80%;
    max-width: 1200px;

  }
}

@media all and (min-width: 1200px) {
  .purchase-container {
    width: 90%;
    max-width: 1200px;
  }
}
</style>