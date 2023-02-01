// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

// puppeteer usage as normal
puppeteer.launch({
    channel: 'chrome',
    headless: false
}).then(async browser => {
    const pages = await browser.pages()
    const page = pages[0]
    await page.goto('https://chat.openai.com')
    // 登录流程
    const loginBtnSelector = '.btn.flex.justify-center.gap-2:nth-child(1)'
    await page.waitForSelector(loginBtnSelector)
    await new Promise(r => setTimeout(r, 2000))
    await page.click(loginBtnSelector)
    const accountInputSelector = '#username'
    await page.waitForSelector(accountInputSelector)
    await page.type(accountInputSelector, 'shampoo6@163.com')
    await new Promise(r => setTimeout(r, 2000))
    await page.click('button[type="submit"]')
    const pwdInputSelector = '#password'
    await page.waitForSelector(pwdInputSelector)
    await page.type(pwdInputSelector, 'badboy0619')
    await new Promise(r => setTimeout(r, 2000))
    await page.click('button[type="submit"]')

    // 聊天流程
    const headlessuiSelector = '#headlessui-portal-root'
    await page.waitForSelector(headlessuiSelector)
    await page.$eval(headlessuiSelector, (el: HTMLElement) => {
        el.style.display = 'none'
    })
    // 获取输入框
    const textareaSelector = 'textarea'
    await page.waitForSelector(textareaSelector)
    await page.type(textareaSelector, '你能描述一下什么是人工智能吗')
    const sendBtnSelector = '.absolute.p-1.rounded-md.text-gray-500'
    await page.waitForSelector(sendBtnSelector)
    await page.click(sendBtnSelector)
    await page.waitForTimeout(1000)
    // 发送图标
    const sendIconSelector = `${sendBtnSelector}>svg`
    await page.waitForSelector(sendIconSelector, {timeout: 120000})
    console.log('ai回答完毕');
    // 最后一个会话框
    const conversationContainerSelector = '.flex.flex-col.items-center.text-sm.h-full'
    let result = await page.$eval(conversationContainerSelector, el => {
        const alls = el.querySelectorAll('.w-full.border-b')
        return alls[alls.length - 1].textContent
    })
    console.log('result: ', result);
    await browser.close()
})
