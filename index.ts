import { Paper } from "./type";
import pdf from "html-pdf";
import fs from "fs";
import pdfjam from "pdfjam";
export function renderPDF(paper: Paper) {
  pdf
    .create(fs.readFileSync("./index.html", "utf8"), {
      width: "10.5cm",
      height: "29.7cm",
      border: {
        top: "0.5cm",
        bottom: "0.5cm",
      },
      base: "http://q.benedu.co.kr",
    })
    .toFile("./test.pdf", async (err, res) => {
      if (err) throw err;
      console.log(
        await pdfjam.nup("./test.pdf", 1, 2, {
          outfile: "combined.pdf",
        })
      );
    });
  //   paper.Table01.forEach((e) => console.log(e.EXE_HTML, e.QST_HTML));
}
