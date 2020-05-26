import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import { renderPDF } from './renderer'
import admin from 'firebase-admin';

admin.initializeApp()

const app = new Koa()
const router = new Router()
app.use(bodyParser());

const port = process.env.port || 8080

router.post('/renderPdf', async (ctx) => {
    const filename = await renderPDF(ctx.request.body)
    const bucket = admin.storage().bucket('benepanda-renderer.appspot.com');
    await bucket.upload(`./pdf/${filename}.pdf`, {
        destination: `${filename}.pdf`
    })
    await bucket.upload(`./thumbnail/${filename}_thumbnail.png`)
    ctx.body = {
        pdf: `${filename}.pdf`,
        thumbnail: `${filename}_thumbnail.png`
    }
})

app
    .use(router.routes())
    .use(router.allowedMethods())


app.listen(port, () => console.log(`Server is Running on ${port}`))
