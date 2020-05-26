import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import { renderPDF } from './renderer'

const app = new Koa()
const router = new Router()
app.use(bodyParser());

const port = process.env.port || 8080

router.post('/renderPdf', async (ctx) => {
    const filename = await renderPDF(ctx.request.body)
    ctx.body = {
        pdf: `${filename}.pdf`,
        thumbnail: `${filename}_thumbnail.png`
    }
})

app
    .use(router.routes())
    .use(router.allowedMethods())


app.listen(port, () => console.log(`Server is Running on ${port}`))
