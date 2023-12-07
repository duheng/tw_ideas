// Import puppeteer
import puppeteer from 'puppeteer';
import fs from 'fs';
import { getListAction, writeJSONFile, delay, numbersIterator } from './item.js';

(async () => {
   
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false});

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('https://www.tradingview.com/markets/cryptocurrencies/ideas/');

  const robotAction = async () => {
    const ListSelector = '.js-balance-content > .js-feed__item--inited'; // 替换为实际的列表选择器
    // 1 - 爬取本页数据
    const __LIST = await getListAction(page, ListSelector)
    let __newList = [...__LIST]
    // 2 - 爬取joined时间
    for(const item of __newList) {
      await delay(2500)
      await page.goto(`https://www.tradingview.com${item.jumpDom}`);
      await page.waitForSelector('.tv-profile__title-info-item--joined')
      const joinedText = await page.evaluate(() => {
        return document.querySelector('.tv-profile__title-info-item--joined time')?.textContent.trim();
      });
      item['joined'] = joinedText
    }
    // 3 - 写入文件
    writeJSONFile(__newList)
  }

  // 一: 爬取首页数据
  await robotAction()
  await delay(3000)
  // 二: 爬取其他页数据
  const numbers = numbersIterator(2,500)
  for (const number of numbers) {
    console.log(`https://www.tradingview.com/markets/cryptocurrencies/ideas/page-${number}/`); // 输出当前数字
    await page.goto(`https://www.tradingview.com/markets/cryptocurrencies/ideas/page-${number}/`);
    await delay(5000)
    await robotAction()
  }
 
 // 1 - 爬取本页数据的加入时间
    // await delay(3000)
    // await page.goto('https://www.tradingview.com/markets/cryptocurrencies/ideas/page-2/');
    // await delay(3000)
    // const __LIST2 = await getListAction(page, ListSelector)
    // writeJSONFile(__LIST2)

    
    
})();