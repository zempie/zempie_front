<template>
  <div class="content">
    <div class="purchase-container">
      <div class="top flex content-center items-center">
        <h3><span class="zem-color"> {{ user?.nickname }}({{ user?.name }})</span>님, 이제 젬파이를 즐겨보세요!</h3>
      </div>
      <div class="purchase-info">
        <div class="row justify-between text-bold">
          <h2>결제완료</h2>
          <p class="my-zem">
            <b class="mr5">내 ZEM</b>
            <Coin :coin="user.coin.zem" />
          </p>
        </div>
        <div class="mt20">
          <p class="font18 text-bold pb10">{{ user?.nickname }}의 주문이 완료되었습니다.</p>
          <p class="font16 ">주문확인 번호 <span class="zem-color">{{ receipt?.order_id }}</span></p>

          <p class="mt30 font18 text-bold">주문 상품 </p>
          <hr />

          <p class="font16 row product-info mt10 mb30">
            <span>상품명 {{ receipt?.order_name }}</span>
            <span> 가격 <span class="zem-color">{{ receipt?.price }}원</span></span>
          </p>

          <p class="font18 text-bold">결제방법</p>
          <hr />
          {{ receipt?.method }}

        </div>

      </div>
      <div class="bottom">
        <p class="flex justify-end"> <button class="btn-default">확인</button></p>
      </div>
      <p class="warning-info">
        <li> 구매한 지 7일이 경과하지 않았으며 사용하지 않은 상품만 청약 철회할 수 있습니다. 더 자세한 내용은 젬파이 고객센터로 연락주시기 바랍니다.
        </li>
      </p>
    </div>

  </div>
</template>
<script setup lang="ts">
const user = computed(() => useUser().user.value.info)
const receipt = computed(() => useCoin().coin.value.receipt)

//TODO: temp
// const tempCoin = 10
// const tempOrdNum = 'djasksdjk232edja2'
// const prodName = '120Cube'
// const prodPrice = 1100
// const purchaseMethod = '결제방법 서버에서! '
</script>
<style scoped lang="scss">
.purchase-container {
  margin: 30px auto 10px auto;
  width: 1200px;
  border-radius: 10px;
  background-color: #fff;
  flex-direction: column;

  hr {
    background-color: #d5d5d5;
    height: 1px;
    border: 0;
  }

  .top {
    height: 80px;
    border-bottom: 1px solid #d5d5d5;
    padding: 50px;

    h3 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .purchase-info {
    padding: 30px 50px;

    h2 {
      font-size: 24px;
      font-weight: 600;
    }

    .my-zem {
      font-size: 16px;
    }

    .product-info {
      span {
        width: 50%;
      }
    }
  }

  .bottom {
    height: 100px;
    padding: 30px 50px;
    border-top: 1px solid #d5d5d5;


    h3 {
      font-size: 20px;
      font-weight: 600;
    }


    .btn-default {
      border-radius: 10px !important;
      width: 30% !important;
    }
  }

  .warning-info {
    background-color: #ededed;
    padding: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
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