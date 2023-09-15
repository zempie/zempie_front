import flutterBridge from "~~/scripts/flutterBridge"

export default function () {
  const mobile = useState('mobile', () => ({
    isFlutter: false,
    platform: undefined
  }))

  const setMobileState = async () => {
    mobile.value.isFlutter = await flutterBridge().isFlutter()
  }
  const setMobilePlatform = async () => {
    mobile.value.platform = await flutterBridge().currentPlatform()
    console.log('mobile.value.platform', mobile.value.platform)
  }

  const openMobileFile = async (options: { type: string, multiple: boolean }) => {
    return await flutterBridge().openFile(options)
  }


  return {
    mobile,
    setMobileState,
    openMobileFile,
    setMobilePlatform
  }
}
