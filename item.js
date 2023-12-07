import fs from 'fs';
export const getListAction = async (page, ListSelector) => {
    let LIST = []
    // 获取列表项
    const listItems = await page.$$(ListSelector);
    // 循环列表项并执行悬停操作
    for (const listItem of listItems) {
        // 在页面上下文中获取每个列表项的文本内容或其他信息（根据需要）
        const titleText = await listItem.evaluate(node => node.querySelector('.tv-widget-idea__title-row')?.textContent.trim());
        const activeButton = await listItem.$('.js-userlink-popup');
        if (activeButton) {
                // 模拟悬停到按钮上
            await activeButton.hover();
            await page.waitForSelector('.tv-user-link-popup', { visible: true }); //等待弹窗
            const popupData = await page.evaluate(() => {
                const popupElement = document.querySelector('.tv-user-link-popup'); // 替换成您的弹出窗口选择器
                const name = popupElement.querySelector('.tv-user-link-popup__name-link')?.textContent.trim()
                const followers = popupElement.querySelector('.tv-user-link-popup__info-item--users .tv-user-link-popup__info-value')?.textContent.trim()
                const ideas =  popupElement.querySelector('.tv-user-link-popup__info-item--comment .tv-user-link-popup__info-value')?.textContent.trim()
                const reputation = popupElement.querySelector('.tv-user-link-popup__info-item--chart .tv-user-link-popup__info-value')?.textContent.trim()
                const jumpDom =  popupElement.querySelector('.tv-user-link-popup__avatar').getAttribute('href')
                return {
                    name,
                    followers,
                    ideas,
                    reputation,
                    jumpDom
                }; // 或者根据实际情况提取您需要的数据
            });
            LIST.push({...popupData,title:titleText})
            await delay(2000);
            await page.mouse.move(0, 0);
        } else {
            console.error('找不到要悬停的按钮。');
            continue; // 如果找不到按钮，则跳过当前列表项，继续下一个
        }
    }
    return LIST
}


const readJsonFromFile = async (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (parseError) {
            reject(parseError);
          }
        }
      });
    });
  }
  
  export const writeJSONFile = async (newData) => {
    const filePath = 'data.json';
    // const existingData = await readJsonFromFile(filePath).catch(() => ({}));
  
    // // 合并新数据和现有数据
    // const mergedData = { ...existingData, ...newData };
  
    // 将合并后的数据写回到文件中
    fs.appendFileSync(filePath, JSON.stringify(newData, null, 2));
  }


export const  delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

export const numbersIterator = (start = 1,num = 100) => {
  let numbers = {
    *[Symbol.iterator]() {
      for (let i = start; i <= num; i++) {
        yield i;
      }
    }
  };
  return numbers
}