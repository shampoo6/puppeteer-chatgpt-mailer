import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import signInChat from "./workers/signInChat.js";
import createAttachment from "./workers/createAttachment.js";
import {AI} from "./helper/ai";
import sendMail from "./workers/sendMail.js";

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        channel: 'chrome',
        headless: false
    })
    const pages = await browser.pages()
    const page = pages[0]
    await page.goto('https://chat.openai.com')
    // 登录
    await signInChat(page)

    // 初始化AI
    AI.createAI(page)

    // 构造附件
    await createAttachment(page)

    // 发送邮件
    await sendMail()

})()
