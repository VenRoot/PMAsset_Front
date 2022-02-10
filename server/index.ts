import https from "http2";
import fs from "fs";
import path from "path";
import url from "url";
import dotenv from "dotenv";

dotenv.config();

const options:https.SecureServerOptions = {
    key: fs.readFileSync(path.join(__dirname, "certs/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs/cert.pem")),
    minVersion: "TLSv1.3"
};

const server = https.createSecureServer(options, async (req, res) => {
    console.log('Aktuelle Path: '+__dirname);
    let requrl = path.join(__dirname, `../out/${req.url?.substr(1)}`);
    if(req.url === undefined) return;
    res.setHeader('Cache-control', 'public, max-age=31536000');
    const urlstring = url.parse(req.url);
    if(urlstring.pathname && urlstring.pathname != "/" && !urlstring.pathname.endsWith(".html")) {
        console.log("Ist keine HTML");
        if(urlstring.pathname.endsWith("/css/styles.pure.css"))
        {
            res.writeHead(200, {'Content-Type': 'text/css'});
            return res.end(fs.readFileSync(path.join(__dirname, "../out/css/styles.pure.css")));
        }
        console.log(urlstring.pathname);
        console.log(requrl);
        if(fs.existsSync(requrl)) {
            if(fs.lstatSync(requrl).isDirectory()) {
                requrl = path.join(requrl, "index.html");
            }
            if(fs.existsSync(requrl) && (requrl.endsWith(".js") || requrl.endsWith(".mjs")))
            {
                console.log("Server requestred JS file");
                res.writeHead(200, {
                    "Content-Type": "application/javascript"
                });
                return res.end(fs.readFileSync(requrl));
            }

            if(fs.existsSync(requrl)) { res.writeHead(200); return res.end(fs.readFileSync(requrl)); }
            res.writeHead(404); 
            return res.end(fs.readFileSync(path.join(__dirname, "../", "out/404.html")));
            
        }
        res.writeHead(404);
        return res.end(fs.readFileSync(path.join(__dirname, "../", "out/404.html")));
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
        return res.end(fs.readFileSync(path.join(__dirname, "../", "out/404.html")));
    }
}).listen(Number(process.env.PORT) || 3000, "0.0.0.0", undefined, undefined).on("listening", () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

process.on("uncaughtException", () =>
{
    server.listen(Number(process.env.PORT) || 3000, "0.0.0.0", undefined, undefined).on("listening", () => {
        console.log(`Server listening on port ${process.env.PORT || 3000}`);});
});

//create a function to handle requests and send response