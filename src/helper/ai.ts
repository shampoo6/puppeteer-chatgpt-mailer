import {Page} from "puppeteer";
import {wait} from "../utils/utils";

export class AI {
    private static _instance: AI;

    private page: Page
    // 超时时间
    private timeout: 120000
    // 输入框
    private textareaSelector = 'textarea'
    // 发送按钮
    private sendBtnSelector = '.absolute.p-1.rounded-md.text-gray-500'
    // 发送图标(纸飞机)
    private sendIconSelector = '.absolute.p-1.rounded-md.text-gray-500>svg'
    // 会话框容器
    private conversationContainerSelector = '.flex.flex-col.items-center.text-sm.h-full'
    // 会话框
    private conversationSelector = '.w-full.border-b'

    private constructor(page: Page) {
        this.page = page
        AI._instance = this
    }

    public static createAI(page: Page) {
        AI._instance || new AI(page)
    }

    public static getInstance() {
        return AI._instance
    }

    /**
     * 回答问题
     * @param question 问题
     * @return 回答的答案
     */
    public async answer(question: string): Promise<string> {
        await this.page.waitForSelector(this.textareaSelector)
        await this.page.$eval(this.textareaSelector, (el: HTMLTextAreaElement, question: string) => {
            el.value = question
        }, question)
        await this.page.waitForSelector(this.sendBtnSelector)
        await this.page.click(this.sendBtnSelector)
        await wait(1000)
        await this.page.waitForSelector(this.sendIconSelector, {timeout: 0})
        return await this.page.$eval(this.conversationContainerSelector, (el: HTMLElement, selector: string) => {
            const alls = el.querySelectorAll(selector)
            return alls[alls.length - 1].textContent
        }, this.conversationSelector)
    }
}
