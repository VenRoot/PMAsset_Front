import https from "http2";
import fs from "fs";
import path from "path";
import url from "url";
import dotenv from "dotenv";
import s from "node-schedule";

//Require the modules for br encoding
import { brotliCompressSync } from "zlib";

//Check the current directory, make sure it's the server directory
if(!process.cwd().includes("server"))
{
    process.chdir(path.join(process.cwd(), "server"));
}
dotenv.config();
//renew the dotenv file every minute
setInterval(() => {
    dotenv.config();
}, 60 * 1000);

const options:https.SecureServerOptions = {
    key: fs.readFileSync(path.join(__dirname, "certs/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs/cert.pem")),
    minVersion: "TLSv1.3"
};

const server = https.createSecureServer(options, async (req, res) => {
    if(process.env.MAINTENANCE)
    {
        res.writeHead(503, {
            "Content-Type": "text",
        });
        return res.end(fs.readFileSync(path.join(__dirname, "../", "out/503.html")));
    }
    let requrl = path.join(__dirname, `../out/${req.url?.substr(1)}`);
    if(req.url === undefined) return;
    res.setHeader('Cache-control', 'public, max-age=31536000');

    //Enable compression
    res.setHeader('Content-Encoding', 'br');

    const urlstring = url.parse(req.url);
    if(urlstring.pathname && urlstring.pathname != "/" && !urlstring.pathname.endsWith(".html")) {
        console.log("Ist keine HTML");
        if(urlstring.pathname.endsWith(".css"))
        {
            res.removeHeader("Content-Encoding");
            res.writeHead(200, {'Content-Type': 'text/css'});
            return res.end(brotliCompressSync(fs.readFileSync(path.join(__dirname, "../", "out/503.html"))));
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
                return res.end(brotliCompressSync(fs.readFileSync(requrl)));
            }

            if(fs.existsSync(requrl)) { res.writeHead(200); return res.end(brotliCompressSync(fs.readFileSync(requrl))); }
            res.writeHead(404); 
            return res.end(brotliCompressSync(fs.readFileSync(path.join(__dirname, "../", "out/404.html"))));
            
        }
        res.writeHead(404);
        return res.end(brotliCompressSync(fs.readFileSync(path.join(__dirname, "../", "out/404.html"))));
    }
    console.log(requrl);
    if(fs.existsSync(requrl))
    {
        res.writeHead(200);
        if(fs.lstatSync(requrl).isDirectory()) return res.end(brotliCompressSync(fs.readFileSync(path.join(requrl, "index.html"))));

        return res.end(brotliCompressSync(fs.readFileSync(requrl)));
    }
    else
    {
        res.writeHead(404);
        return res.end(brotliCompressSync(fs.readFileSync(path.join(__dirname, "../", "out/404.html"))));
    }
}).listen(Number(process.env.PORT) || 3000, "0.0.0.0", undefined, undefined).on("listening", () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

process.on("uncaughtException", () =>
{
    //Cleanup before starting the server again
    server.close();
    server.listen(Number(process.env.PORT) || 3000, "0.0.0.0", undefined, undefined).on("listening", () => {
        console.log(`Server listening on port ${process.env.PORT || 3000}`);});
});



//Schedule a task to run all 10 minutes
s.scheduleJob("0 */5 * * * *", () => {
    //monitor the memory usage and the heap
    let x = "";
    x+=("Time of monitoring: " + new Date().toLocaleTimeString()+"\n");
    x+=(`Heap usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n`);
    x+=(`Memory usage: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\n`);
    fs.appendFileSync(path.join(__dirname, "..", "logs/heap.log"), x+"\n", {encoding: "utf8"});	
});