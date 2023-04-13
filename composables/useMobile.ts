import flutterBridge from "~~/scripts/flutterBridge"

export default function () {
  const mobile = useState('mobile', () => ({
    isFlutter: false
  }))

  const setMobileState = async () => {
    mobile.value.isFlutter = await flutterBridge().FlutterBridge.isFlutter()
  }

  const openMobileFile = async (options: { type: string, multiple: boolean }) => {
    return await flutterBridge().FlutterBridge.openFile(options)
  }


  return {
    mobile,
    setMobileState,
    openMobileFile
  }
}
