import _ from 'lodash'

export default function () {
  const post = useState('post', () => ({
    type: 'SNS',
    img: []
  }))

  const setType = (type: string) => {
    post.value.type = type;
  }




  return {
    post,
    setType
  }
}