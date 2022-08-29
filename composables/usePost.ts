import _ from 'lodash'

export default function () {
  const post = useState('post', () => ({
    type: 'SNS',
    img: []
  }))

  const setType = (type: string) => {
    post.value.type = type;
  }

  const setImg = (img) => {
    post.value.img = _.uniqBy([...post.value.img, img],
      'src')
  }
  const resetImg = () => {

  }




  return {
    post,
    setImg,
    setType
  }
}