
export default async function () {
  const BP = (await import("@bootpay/client-js")).default
  const config = useRuntimeConfig()


  const BootPay = {
    async requestPay(payload) {
      const response = await BP.requestPayment({
        "application_id": config.BOOTPAY_JS_KEY,
        "price": payload.price,
        "order_name": "ZEM 구매",
        "order_id": "TEST_ORDER_ID",
        "pg": "나이스페이",
        "method": "카드",
        "tax_free": 0,
        "user": {
          "id": payload.user_id,
          "username": payload.username,
          "email": payload.user_email
        },
        "items": [
          {
            "id": payload.item_id,
            "name": payload.name,
            "qty": 1,
            "price": payload.price
          }
        ],

      })
    }
  }
  return BootPay
}