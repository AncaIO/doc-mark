import fs from 'fs-extra'

export default function handler(req, res) {
  const { id } = req.query
  const filePath = `${process.env.NEXT_PUBLIC_DOCS_UNIX_PATH}${id.join('/')}${process.env.NEXT_PUBLIC_DOCS_FORMAT}`
  console.log(req.body)
  fs.outputFile(filePath, req.body, {}, (err, f) => {
    if (err) {
      res.status(400).json({ message: `Something went wrong when trying to save Doc with id: ${filePath}.` })
    }
    res.status(200).json({
      message: `Saved Doc with id: ${filePath}.`
    })
  })
}