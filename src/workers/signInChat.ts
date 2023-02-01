import {Page} from "puppeteer";
import {wait} from "../utils/utils";
import {chatConfig} from "../config/chatConfig.js";

// 登录流程
export default async function (page: Page): Promise<void> {
    const loginBtnSelector = '.btn.flex.justify-center.gap-2:nth-child(1)'
    await page.waitForSelector(loginBtnSelector)
    await wait(2000)
    await page.click(loginBtnSelector)
    const accountInputSelector = '#username'
    await page.waitForSelector(accountInputSelector)
    await page.type(accountInputSelector, chatConfig.email)
    await wait(2000)
    await page.click('button[type="submit"]')
    const pwdInputSelector = '#password'
    await page.waitForSelector(pwdInputSelector)
    await page.type(pwdInputSelector, chatConfig.password)
    await wait(2000)
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
    await wait(1000)
    const headlessuiSelector = '#headlessui-portal-root'
    await page.waitForSelector(headlessuiSelector)
    await page.$eval(headlessuiSelector, (el: HTMLElement) => {
        el.style.display = 'none'
    })
}
