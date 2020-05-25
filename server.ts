import Koa from 'koa'
import Router from 'koa-router'
import send from 'koa-send'
import bodyParser from 'koa-bodyparser'

import { renderPDF } from './renderer'
import { existsSync } from 'fs'

const app = new Koa()
const router = new Router()
app.use(bodyParser());

router.post('/renderPdf', async (ctx, next) => {
    console.log('ㅁ.. 뭔가 들어옴..', ctx.request.body)
    const filename = await renderPDF(ctx.request.body)
    ctx.body = {
        filename
    }
})

router.get('/pdf/:url', async (ctx) => {
    const { url } = ctx.params
    console.log(url, url.length, url.length === 24, url.slice(-4) === '.pdf')
    if (url.length === 24 && url.slice(-4) === '.pdf' && existsSync(`./pdf/${ctx.params.url}`)) await send(ctx, `./pdf/${ctx.params.url}`);
    else ctx.body = '지랄마'
})

app
    .use(router.routes())
    .use(router.allowedMethods())

const port = process.argv[2]
const pdfjam = process.argv[3]

app.listen(port, () => console.log(`Server is Running on ${port}, PDFJam is on ${pdfjam}`))
