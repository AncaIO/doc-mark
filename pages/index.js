import { useEffect, useState } from 'react'
import Spacer from 'components/spacer'
import Padding from 'components/padding'
import Button from 'components/button'
import Link from 'next/link'

import matter from "gray-matter"
import glob from 'glob'
import fs from 'fs-extra'

export default function Home({ docs }) {
  const [dark, setDark] = useState(false)

  const [documents, setDocuments] = useState([])

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

    if (!documents.length) {
      setDocuments(docs)
    }
  }, [])

  const toggleDarkMode = () => {
    const nextTheme = dark ? 'light' : 'dark'
    localStorage.setItem('theme', nextTheme)
    setDark(!dark)
  }

  return (
    <>
      <Padding all={2}>
        <h1>Mark</h1>
        <Spacer y={1} />
        <p>Web Markdown Editor</p>
        <Spacer y={2} />
        <div className='toolbar'>
          <p>
            <Button onClick={toggleDarkMode}>Toggle Dark Mode</Button>

          </p>
        </div>
        <Spacer y={2} />
        <main>
          <div className="container">
            {documents.length
              ? <div className="documents">
                {documents.map((doc, index) => {
                  return <div className="doc-link" key={`doc-${index}`}>
                    <Link href=
                      {{
                        pathname: `docs/${doc.url}`,
                      }}
                      passHref>
                      <a>
                        {doc.title ? doc.title : doc.path}
                        <div className="doc-path">{doc.url}</div>
                      </a>
                    </Link>

                  </div>
                })}
              </div>
              : null}
          </div>
        </main>
      </Padding>
      <style jsx global>
        {`
          body {
            --bg: ${!dark ? '#ECEFF4' : '#121212'};
            --fg: ${!dark ? '#2E3440' : '#D8DEE9'};
            --shadow-color: ${dark
            ? 'rgb(15 17 21 / 20%) 0px 3px 6px 0px;'
            : 'rgba(0, 0, 0, 0.12);'
          }
        `}
      </style>
      <style jsx>
        {`
          .doc-link {
            margin-bottom: 16px;
          }
          .doc-path {
            color: #c4c4c4;
            font-size: 12px;
          }
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
            flex-direction: column;
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
            font-family: 'Nanum Gothic', sans-serif;
            height: calc(100vh / 1.25);
            border: 2px solid var(--fg);
            border-radius: 8px;
            resize: none;
            padding: 20px;
            overflow: auto;
            box-shadow: 0px 1px 4px var(--shadow-color);
          }

          .editor {
            background: ${dark ? '#191919' : 'transparent'};
            border: 0;
            border-radius: 8px;
            // border-right: 1px solid var(--fg);
          }
        `}
      </style>
    </>
  )
}

export async function getStaticProps() {
  let docs = []
  const PATH = process.env.NEXT_PUBLIC_DOCS_READ_PATH
  const REPLACE = process.env.NEXT_PUBLIC_DOCS_UNIX_PATH.replace('C:\/\/', 'C:\/')
  const FORMAT = process.env.NEXT_PUBLIC_DOCS_FORMAT

  let files = await glob.sync(`${PATH}/**/*${FORMAT}`)

  files.map(f => {
    if (!f.includes('node_modules')) {
      let cleanName = f.replace(FORMAT, '').replace(REPLACE, '')
      let fileContents = fs.readFileSync(f, 'utf-8')
      let matterDoc = matter(fileContents)
      let { name, title } = matterDoc.data
      docs.push({
        path: f,
        url: cleanName,
        name: name || cleanName,
        title: title || cleanName,
        raw: fileContents
      })
    }
  })
  return {
    props: {
      docs
    },
  }
}