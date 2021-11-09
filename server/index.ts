import https from "https";
import fs from "fs";
import path from "path";
import url from "url";

const options = {
    key: fs.readFileSync(path.join(__dirname, "certs/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs/cert.pem"))
};

https.createServer(options, async (req, res) => {
    let requrl = path.join(__dirname, `../out/${req.url?.substr(1)}`);
    if(req.url === undefined) return;
    const urlstring = url.parse(req.url);
    if(urlstring.pathname && urlstring.pathname != "/" && !urlstring.pathname.endsWith(".html")) {
        console.log("Ist keine HTML");
        if(fs.existsSync(req.url)) {
            res.writeHead(200);
            return res.end(fs.readFileSync(requrl));
        }
        res.writeHead(404);
        return res.end("404");
    }
    console.log(requrl);
    if(fs.existsSync(requrl))
    {
        console.log(`Existiert: ${requrl}`)
        res.writeHead(200);
        if(fs.lstatSync(requrl).isDirectory()) return res.end(fs.readFileSync(path.join(requrl, "index.html")));

        console.log("Nö");
        return res.end(fs.readFileSync(requrl));
    }
    else
    {
        res.writeHead(404);
        return res.end(fs.readFileSync("../out/404.html"));
    }
}).listen(process.env.PORT || 3000).on("listening", () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});