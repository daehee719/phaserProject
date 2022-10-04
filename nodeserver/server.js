const http = require('http');
const server = http.createServer((req,res)=>
{
    switch(req.url)
    {
        case "/":
            res.end("Hello world!!");
            break;
        case "/image":
            res.end("image page");
            break;
    }
    res.end("hello world");
});

server.listen(9090,()=>
{
    console.log(`서버가 9090 포트에서 실행중입니다.`);
});