# puppeteer-chatgpt-mailer

> 该项目已转移到了 [puppeteer-chatgpt-mailer](https://github.com/shampoo6/puppeteer-chatgpt-mailer) 

通过 OpenAI 的 ChatGPT 帮助完成并发送邮件

## 特点

- 使用 html 模板构建邮件
- 邮件主题 内容 签名 部分，使用 ejs 模板可以填充参数
- 使用 nodemailer 发送邮件
- 自动生成附件

## ejs 内置参数

项目中已默认设置了一些 ejs 的参数，可以在字符串配置项的任意位置使用 `<%=param%>` 来配置这些内置参数

内置参数如下:

| 参数     | 描述                    |
|--------|-----------------------|
| `date` | 格式为 `YYYY-MM-DD` 的日期值 |

