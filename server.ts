import Koa from 'koa'
import Router from 'koa-router'
import send from 'koa-send'
import bodyParser from 'koa-bodyparser'

import { renderPDF } from './'

const app = new Koa()
const router = new Router()
app.use(bodyParser());

router.post('/', async (ctx, next) => {
    const filepath = await renderPDF(ctx.request.body)
    await send(ctx, filepath)
})

app
    .use(router.routes())
    .use(router.allowedMethods())
app.listen(8080)