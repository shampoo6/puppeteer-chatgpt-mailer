import {getBodyContent, render, renderString} from "../utils/utils";
import {chatConfig} from "../config/chatConfig";
import path from "path";
import {MailTemplate} from "../types/MailTemplate";
import {AI} from "../helper/ai";
import {mailCommonConfig} from "../config/mailCommonConfig.js";
import {Mail} from "../types/Mail";
import fs from "fs";
import {sendMail} from "../utils/mailer";

export default async function (): Promise<void> {
    // 读取配置
    const templatePath = path.join(__dirname, '../templates', chatConfig.template)
    const mod = await import(templatePath)
    const template: MailTemplate = mod.default

    // 构造询问AI的问题
    // 构造要求
    // const requires = mixRequires([...chatConfig.requires, ...template.requires])
    // let question = renderPrompts(requires)
    // question += template.template
    // question = renderString(question, template.params)

    let question = render(template.template, false, template.requires, template.params)

    // 提问
    let content = await AI.getInstance().answer(question)
    content = getBodyContent(content)
    console.log(content)

    // 构造mail对象
    const mail: Mail = {
        ...mailCommonConfig,
        ...template.mail,
        content,
    }

    // 判断是否需要附件
    if (template.attachments) {
        // 添加附件
        mail.attachments = [{
            filename: '资料.zip',
            content: fs.createReadStream(path.join(__dirname, '../../', '资料.zip'))
        }]
    }

    // 编译签名
    mail.sign = renderString(mail.sign, {...template.params, sender: mail.sender})
    // 编译主题
    mail.subject = renderString(mail.subject, template.params)
    // 编译内容
    mail.content = renderString(mail.content, template.params)
    const res = await sendMail(mail)
    console.log(res)
    if (res.accepted && res.accepted.length > 0) {
        // await wait(3000)
        // app.quit()
    }
}
