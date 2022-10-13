import _ from 'lodash'

export default function () {
  const post = useState('post', () => ({
    type: 'SNS',
    img: [],
    isFullScreen: false
  }))

  const setType = (type: string) => {
    post.value.type = type;
  }

  const setFullScreen = (state: boolean) => {
    post.value.isFullScreen = state;

  }




  return {
    post,
    setType,
    setFullScreen
  }
}