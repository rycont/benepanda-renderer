import { Paper } from "./type";
import pdf from "html-pdf";
import { spawn } from "child_process";
import { writeFileSync } from 'fs'

export function renderPDF(paper: Paper): Promise<string> {
    return new Promise((resolve, reject) => {
        console.time('start')
        let htmlString = `<head>
    <style>
    @import url("https://cdn.jsdelivr.net/gh/moonspam/NanumBarunGothic@latest/nanumbarungothicsubset.css");
    @import url("https://fonts.googleapis.com/earlyaccess/kopubbatang.css");

    @font-face {
        font-family: 'RIDIBatang';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    body {
        font-family: NanumBarunGothic;
        margin: 3px;
    }

    table {
        width: 100%;
        font-family: 'KoPub Batang';
        text-align: justify;
        line-height: 28px;
        font-size: 0.8rem;
    }

    p.number {
        font-size: 1rem;
        font-weight: bold;
        margin-top: 6px;
    }

     * {
        max-width: 300px;
     }
     article.sunda {
         font-size: 0.8rem;
     }
</style></head>`;
        paper.Table01.forEach((e) => {
            if (e.EXE_RANGE) htmlString += `<p class="range">${e.EXE_RANGE}</p>`
            if (e.EXE_HTML) htmlString += `<p>
        ${e.EXE_HTML}
        </p>`
            htmlString += `<p class="number">
    ${e.IBQ_NUM}.
    </p>`
            if (e.QST_HTML) htmlString += `<article class="sunda">
        ${e.QST_HTML}
        </article>`
        });
        htmlString = htmlString.split(/width=".*?"/).join('').split('&nbsp;&nbsp;&nbsp;').join(' ')
        writeFileSync('./index.html', htmlString)
        pdf
            .create(htmlString, {
                width: "10.5cm",
                height: "29.7cm",
                base: "http://q.benedu.co.kr",
            })
            .toFile(`./TEMP_${paper.Table02[0].IBT_NAME}.pdf`, async (err, res) => {
                if (err) reject(err);
                spawn("pdfjam", [
                    "--nup",
                    " 2x1",
                    "--scale",
                    "0.95",
                    `./TEMP_${paper.Table02[0].IBT_NAME}.pdf`,
                    "--outfile",
                    `./${paper.Table02[0].IBT_NAME}.pdf`,
                ]).addListener('exit', () => {
                    resolve(`./${paper.Table02[0].IBT_NAME}.pdf`)
                }).addListener('error', e => reject(e))
            });
    })
}
