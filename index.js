require('dotenv').config()
const fetch = require('node-fetch')

const headers = new fetch.Headers()
headers.append('X-Figma-Token', process.env.DEV_TOKEN)

const fileKey = process.env.CURRENT_FILE

async function fetchFigmaAPI({ endpoint }) {
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}${endpoint}`, {headers})

  return await res.json()
}

async function init() {
  const { styles } = await fetchFigmaAPI({ endpoint: '/' })
  const nodesIds = Object.keys(styles)

  const { nodes } = await fetchFigmaAPI({ endpoint: `/nodes?ids=${nodesIds.join(',')}` })
  console.log(nodes)

  const formattedStyles = Object.entries(nodes).map(([key, style]) => {
    let value
    let type

    if (style.document.type === 'TEXT') {
      value = style.document.style
      type = style.document.type
    } else {
      value = style.document.fills[0].color
      type = 'COLOR'
    }

    return {
      label: style.document.name,
      value
    }
  })

  console.log(formattedStyles)
}

init()
