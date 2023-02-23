
export default function () {
  const pageTitle = useState('pageTitle')

  const setPageTitle = (title: string) => {
    pageTitle.value = title
  }

  return {
    pageTitle,
    setPageTitle
  }
}
