
export default async function () {
  const BP = (await import("@bootpay/client-js")).default
  const config = useRuntimeConfig()
  interface IReqParam {
    price: number,
    name: string,
    user_id: string,
    username: string,
    user_email: string,
    item_id: string,
    qty: number
  };


  const BootPay = {
    async requestPay(params: IReqParam) {
      const response = await BP.requestPayment({
        "application_id": config.BOOTPAY_JS_KEY,
        "price": params.price,
        "order_name": "ZEM 구매",
        "order_id": "TEST_ORDER_ID",
        "pg": "나이스페이",
        "method": "카드",
        "tax_free": 0,
        "user": {
          "id": params.user_id,
          "username": params.username,
          "email": params.user_email
        },
        "items": [
          {
            "id": params.item_id,
            "name": params.name,
            "qty": 1,
            "price": params.price
          }
        ],
        "metadata": {
          "refitem_id": params.item_id,
          "item_name": params.name
        }

      })
      return response
    }
  }
  return BootPay
}