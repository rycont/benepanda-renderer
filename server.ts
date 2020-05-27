import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import { renderPDF } from './renderer'
import admin from 'firebase-admin';
import { Paper } from './type';

import("./benepanda-renderer-firebase-adminsdk-1cuuc-8ebc257102.json").then(firebaseAccountCredentials => admin.initializeApp({
    credential: admin.credential.cert(firebaseAccountCredentials as admin.ServiceAccount),
    databaseURL: "https://benepanda-renderer.firebaseio.com"
})).catch(() => admin.initializeApp())

// const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount

const app = new Koa()
const router = new Router()
app.use(bodyParser());

const port = process.env.port || 8080
const bucket = admin.storage().bucket('benepanda-renderer.appspot.com');

router.post('/renderPdf', async (ctx) => {
    const requestedPaper: Paper = ctx.request.body
    const paperIdNum = requestedPaper.Table02[0].IBT_ID

    console.log(`${paperIdNum}.pdf`, (await bucket.file(`${paperIdNum}.pdf`).exists())[0])
    if ((await bucket.file(`${paperIdNum}.pdf`).exists())[0]) {
        ctx.body = {
            pdf: `${paperIdNum}.pdf`,
            thumbnail: `${paperIdNum}_thumbnail.png`
        }
        return
    }

    const filename = await renderPDF(requestedPaper)
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
