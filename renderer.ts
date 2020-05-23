import { Paper } from "./type";
import pdf from "html-pdf";
import { exec } from "child_process";
import { writeFileSync, unlink, readFileSync } from 'fs'
import { promisify } from 'util'

const pexec = promisify(exec)
const pcreate = promisify(pdf.create)
const punlink = promisify(unlink)

function makeRandomString(length: number): string {
    return Array(length).fill(0).map(e => String.fromCharCode((Math.random() * 25 + 65))).join('')
}

const prefix = readFileSync('./prefix.html', {
    encoding: "utf-8"
})

export async function renderPDF(paper: Paper): Promise<string> {
    console.time('start')

    const htmlString = prefix + paper.Table01.map((e) => `
        ${e.EXE_RANGE ? `<p class="range"> ${e.EXE_RANGE} </p>` : ''}
        ${e.EXE_HTML ? `<p> ${e.EXE_HTML} </p>` : ''}
                         <p class="number"> ${e.IBQ_NUM}. </p>
        ${e.QST_HTML ? `<p class="number"> ${e.QST_HTML} </p>` : ''}
        `).join('').split(/width=".*?"/).join('').split('&nbsp;&nbsp;&nbsp;').join(' ')

    writeFileSync('./index.html', htmlString)
    const filename = makeRandomString(20);

    await (() => new Promise((res) => pdf
        .create(htmlString, {
            width: "10.5cm",
            height: "29.7cm",
            base: "http://q.benedu.co.kr",
        }).toFile(`./TEMP_${filename}.pdf`, res)))()

    const { stderr: jamErr, stdout: output } = await pexec(`pdfjam --nup 2x1 --scale 0.95 ./TEMP_${filename}.pdf --outfile ./pdf/${filename}.pdf`)
    console.log(output)
    await punlink(`./TEMP_${filename}.pdf`)
    return `./pdf/${filename}.pdf`
}
