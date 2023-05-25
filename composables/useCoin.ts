export default function () {
  const coin = useState('coin', () => ({
    receipt: null
  }))

  const setCoinReceipt = (receipt) => {
    coin.value.receipt = receipt;
  }

  const resetCoinReceipt = () => {
    coin.value.receipt = null;
  }

  return {
    coin,
    setCoinReceipt,
    resetCoinReceipt
  }

}