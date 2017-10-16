const fs = require('fs')
const path = require('path')
const camelCase = require('camelcase')

const dataDir = path.join('./', 'data')
const csvDir = path.join(dataDir, 'v2', 'csv')

const data = {}

const files = fs.readdirSync(csvDir)
files.forEach(file => {
  const name = camelCase(path.basename(file).slice(0, -4))
  const filePath = path.join(csvDir, file)
  const csv = fs.readFileSync(filePath).toString('utf8')
  const lines = csv.split('\n').map(line => line.split(','))
  lines.pop()
  const headers = lines.shift().map(header => camelCase(header))
  data[name] = lines.map(line => {
    const item = {}
    headers.forEach((header, index) => item[header] = line[index])
    return item
  })
})
const dataFile = path.join(dataDir, 'data.json')
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
console.log(`wrote ${dataFile}`, JSON.stringify(Object.keys(data), null, 2))
