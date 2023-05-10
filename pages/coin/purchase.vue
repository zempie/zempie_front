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
            <Coin :coin="tempCoin" />
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
const user = computed(() => useUser().user.value.info)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

definePageMeta({
  // middleware: 'auth',
})

const tempCoin = 10


const { data: coinData, error } = await useCustomAsyncFetch('/items', getZempieFetchOptions('get', true))
// const coins = computed(() => coinData.value?.result?.refitems)

const coins = [
  {
    id: 1,
    zem: 10,
    price: 1200,
    img: '/images/coins/shopItem_img_money_small_01.png'
  },
  {
    id: 2,
    zem: 50,
    price: 6000,
    img: '/images/coins/shopItem_img_money_small_02.png'
  },
  {
    id: 3,
    zem: 100,
    price: 12000,
    img: '/images/coins/shopItem_img_money_small_03.png'
  },
  {
    id: 4,
    zem: 300,
    price: 36000,
    img: '/images/coins/shopItem_img_money_mid_04.png'
  },
  {
    id: 5,
    zem: 500,
    price: 60000,
    img: '/images/coins/shopItem_img_money_mid_05.png'
  },
  {
    id: 6,
    zem: 1000,
    price: 120000,
    img: '/images/coins/shopItem_img_money_mid_06.png'
  },
]
const activeCoin = ref(coins[0])

function activateCoin(coin) {
  activeCoin.value = coin
}


async function purchaseCoin() {
  if (user.value) {
    if (isFlutter.value) {
      //TODO: 인앱결제 연결 
    } else {
      const payload = {
        price: activeCoin.value.price,
        name: activeCoin.value.zem + 'ZEM',
        user_id: user.value.id,
        username: user.value.name,
        user_email: user.value.email,
        item_id: activeCoin.value.id,
        qty: 1,
      };

      (await Bootpay()).requestPay(payload)




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