const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const express = require('express')
const app = express()
const port = 5000
let cache = {}

app.get('/', async (req, res) => {
  try {
    windows_useragent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36'
    linux_useragent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36'

    const browser = await puppeteer
      .launch
      //     {
      //   headless: true,
      //   executablePath: '/usr/bin/chromium-browser',
      //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //   ignoreDefaultArgs: ['--disable-extensions'],
      // }
      ()
    const page = await browser.newPage()
    page.setUserAgent(linux_useragent)
    await page.goto('https://www.smard.de/home', { waitUntil: 'networkidle0' })
    var test = await page.content()
    const $ = cheerio.load(test)
    var valueA = parseInt(
      $('li.icon-wind-startpage > p.c-key-data__value')
        .text()
        .match(/\d/g)
        .join('')
    )
    var valueB = parseInt(
      $('li.icon-industry-startpage > p.c-key-data__value')
        .text()
        .match(/\d/g)
        .join('')
    )
    var result = calculate(valueA, valueB)

    var data = {
      a: valueA,
      b: valueB,
      result: result,
    }
    cache = data
    await browser.close()
    res.send(data)
  } catch (error) {
    console.log(error)
    res.send(cache)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function calculate(a, b) {
  return (a * 100) / (a + b)
}
