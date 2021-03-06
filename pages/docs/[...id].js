import { useEffect, useRef, useState } from 'react'
import marked from 'marked'
import Spacer from 'components/spacer'
import Padding from 'components/padding'
import Button from 'components/button'
import matter from "gray-matter"
import glob from 'glob'
import fs from 'fs-extra'

const KEYS = {
  TAB: 9
}

export default function Doc({ doc }) {

  const [value, setValue] = useState(doc.raw)
  const [dark, setDark] = useState(false)
  const textAreaRef = useRef()
  const previewAreaRef = useRef()

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (!theme) {
      localStorage.setItem('theme', 'light')
    }
    if (theme === 'dark') {
      setDark(true)
    }
  }, [])

  useEffect(() => {
    if (!previewAreaRef || !textAreaRef) {
      return
    }

    textAreaRef.current.addEventListener('scroll', function () {
      previewAreaRef.current.scrollTop = textAreaRef.current.scrollTop
    })
  }, [textAreaRef, previewAreaRef])

  const handleKeyDown = (e) => {
    const selStart = e.target.selectionStart

    if (e.keyCode === KEYS.TAB) {
      e.preventDefault()
      let _value = e.target.value
      const tabChars = ' '.repeat(2)
      _value =
        e.target.value.substring(0, e.target.selectionStart) +
        tabChars +
        e.target.value.substring(e.target.selectionEnd)

      e.target.selectionStart = selStart + tabChars.length
      e.target.selectionEnd = selStart + tabChars.length
      setValue(_value)
    }
  }

  const handleKeyUp = (e) => {
    setValue(e.target.value)
  }

  const saveFile = async () => {
    let filePath = `${doc.id.join('/')}`
    return await fetch(`/api/${filePath}`, {
      method: 'POST',
      body: value
    })
  }

  const toggleDarkMode = () => {
    const nextTheme = dark ? 'light' : 'dark'
    localStorage.setItem('theme', nextTheme)
    setDark(!dark)
  }

  const clearContent = () => {
    const shouldClear = window.confirm('Are you sure you want to clear all content')
    if (shouldClear) {
      setValue('')
    }
  }

  return (
    <>
      <Padding all={2}>
        <h1>{doc.title}</h1>
        <Spacer y={1} />
        <p>{doc.path}</p>
        <Spacer y={2} />
        <div className='toolbar'>
          <Button onClick={saveFile}>Save File</Button>
          <Button onClick={toggleDarkMode}>Toggle Dark Mode</Button>
          <Button onClick={clearContent}>Clear</Button>
        </div>
        <Spacer y={2} />
        <main>
          <div className='container'>
            <textarea
              className='editor'
              value={value}
              ref={textAreaRef}
              placeholder='You can type in Markdown here'
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onChange={handleKeyUp}
            />
            <Spacer x={2} />
            <article
              ref={previewAreaRef}
              className='preview'
              dangerouslySetInnerHTML={{ __html: marked(value) }}
            />
          </div>
        </main>
      </Padding>
      <style jsx global>
        {`
          body {
            --bg: ${!dark ? '#ECEFF4' : '#121212'};
            --fg: ${!dark ? '#2E3440' : '#D8DEE9'};
            --shadow - color: ${dark
            ? 'rgb(15 17 21 / 20%) 0px 3px 6px 0px;'
            : 'rgba(0, 0, 0, 0.12);'
          }
  `}
      </style>
      <style jsx>
        {`
  h1,
    p {
    padding: 0;
    margin: 0;
  }

  main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

          .editor,
          .preview {
    outline: #fff;
    line-height: 30px;
    font-size: 18px;
    flex: 1;
    font-family: 'Nanum Gothic', sans - serif;
    height: calc(100vh / 1.25);
    border: 1px dotted var(--fg);
    border-radius: 4px;
    resize: none;
    padding: 20px;
    overflow: auto;
    box-shadow: 0px 1px 4px var(--shadow - color);
  }

          .editor {
    background: ${dark ? '#191919' : 'transparent'};
    border: 0;
    border-radius: 4px;
  }
  `}
      </style>
    </>
  )
}

const PATH = process.env.NEXT_PUBLIC_DOCS_UNIX_PATH
const FORMAT = process.env.NEXT_PUBLIC_DOCS_FORMAT
const REPLACE = process.env.NEXT_PUBLIC_DOCS_UNIX_PATH.replace('C:\/\/', 'C:\/')

export async function getStaticPaths() {

  let paths = []

  let files = await glob.sync(`${PATH}/**/*${FORMAT} `)

  files.map(f => {
    if (!f.includes('node_modules')) {
      let cleanName = f.replace(FORMAT, '').replace(REPLACE, '')
      paths.push({ params: { id: cleanName.split('/') } })
    }
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {

  const FILENAME = `${PATH}/${params.id.join('/')}${FORMAT}`.replace('//', '/')
  let cleanName = FILENAME.replace(FORMAT, '').replace(REPLACE, '')

  let fileContents = fs.readFileSync(FILENAME, 'utf-8')
  let matterDoc = matter(fileContents)
  let { name, title } = matterDoc.data
  return {
    props: {
      doc: {
        path: FILENAME,
        id: params.id,
        name: name || cleanName,
        title: title || cleanName,
        raw: fileContents
      }
    },
  }
}