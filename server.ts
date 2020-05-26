import Koa from 'koa'
import Router from 'koa-router'
import send from 'koa-send'
import bodyParser from 'koa-bodyparser'

import { renderPDF } from './renderer'
import { existsSync } from 'fs'

const app = new Koa()
const router = new Router()
app.use(bodyParser());

const port = process.env.port || 8080

console.log(process.argv)

router.post('/renderPdf', async (ctx, next) => {
    const filename = await renderPDF(ctx.request.body)
    ctx.body = filename
})

app
    .use(router.routes())
    .use(router.allowedMethods())


app.listen(port, () => console.log(`Server is Running on ${port}`))
