import NextHead from 'next/head'

const Head = (props) => {
  return (
    <NextHead>
      <title>DocMark | In-browser Markdown Editor for Local Files</title>
      <link
        href='https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&display=swap'
        rel='stylesheet'
      />

      {props.children}
    </NextHead>
  )
}
export default Head
