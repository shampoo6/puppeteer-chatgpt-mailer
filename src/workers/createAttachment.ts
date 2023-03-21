import {Page} from "puppeteer";
import path from "path";
import {chatConfig} from "../config/chatConfig.js";
import {MailTemplate} from "../types/MailTemplate";
import {AI} from '../helper/ai.js'
import {
    getBodyContent,
    render
} from "../utils/utils.js";
import {JSDOM} from 'jsdom'
import fsp from "fs/promises";
import cp from "child_process";

const rootPath = path.join(__dirname, '../../')
const dirPath = path.join(rootPath, '资料')

// 构造附件
export default async function (page: Page): Promise<void> {
    // 读取配置
    const templatePath = path.join(__dirname, '../templates', chatConfig.template)
    const mod = await import(templatePath)
    const templateConfig: MailTemplate = mod.default
    if (!templateConfig.attachments) return

    // 构造询问AI的问题
    // 构造要求
    // const requires = mixRequires([...chatConfig.requires, ...chatConfig.attachmentsRequires, ...templateConfig.attachmentsRequires])
    // let question = renderPrompts(requires)
    // question += chatConfig.attachmentTemplate
    // question = renderString(question, templateConfig.params)

    let question = render(chatConfig.attachmentTemplate, true, templateConfig.attachmentsRequires, templateConfig.params)

    await clearFile()
    await makeFile(question)
    await makeFile(question)
    await makeFile(question)
    await zipFiles()
}

// 清除历史文件
async function clearFile(): Promise<void> {

    try {
        await fsp.stat(dirPath)
    } catch (e) {
        // 创建文件夹
        await fsp.mkdir(dirPath)
    }

    // 删除压缩文件
    try {
        await fsp.rm(path.join(rootPath, '资料.zip'))
    } catch (e) {
        console.error(e)
    }

    // 遍历文件夹下所有文件
    const fileNames = await fsp.readdir(dirPath)
    fileNames.forEach(filename => {
        const filePath = path.join(dirPath, filename)
        fsp.rm(filePath)
    })
}

async function makeFile(question: string): Promise<void> {
    // 提问
    let answer = await AI.getInstance().answer(question)
    answer = getBodyContent(answer)
//     let answer = `<h1>标题: 利用 Puppeteer 实现自动化测试</h1><ul><li>Puppeteer 是一个谷歌推出的自动化测试工具。</li><li>Puppeteer 可以
// 实现网页的自动化操作，比如点击、填写表单等。</li><li>Puppeteer 使用 Node.js 进行编程，它与 TypeScript 配合使用非常方便
// 。</li><li>Puppeteer 支持生成 PDF，截图等功能，也可以实现对 SPA（单页应用）的自动化测试。</li></ul>`
    console.log(answer)
    // 构造标签
    const document = new JSDOM(`<div>${answer}</div>`).window.document;
    // 构造文件名
    // 提取标题
    const h1 = document.querySelector('h1').textContent
    const filename = h1.match(/(?<=标题:)[\s\S]*$/)[0].trim() + '.txt'
    console.log('filename: ', filename)
    // 提取内容
    let contentArr: string[] = []
    document.querySelectorAll('li').forEach(li => {
        contentArr.push(li.textContent)
    })
    let content = contentArr.join('\n')
    console.log('content: ', content)
    content = filename + '\n' + content

    await fsp.writeFile(path.join(dirPath, filename), content)
}

async function zipFiles() {
    const p = cp.spawn('7z',
        ['a', '资料.zip', '资料'],
        {cwd: rootPath}
    )
    p.on('close', (code) => {
        console.log(`7z child process ${p.pid} exited with code ${code}`)
        console.log(text)
    })
    p.on('error', (err) => {
        console.error(err)
    })
    let text = ''
    p.stdout.on('data', (data) => {
        text += data.toString()
    })
}
