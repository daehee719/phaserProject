import Http,{Server} from 'http';
import Express,{Application} from 'express';
import Path from 'path';

const App : Application = Express();
App.use(Express.static("public"))
App.get("/ggm",(req,res)=>
{
    let filePath : string = Path.join(__dirname,"..","views","index.html");
    res.sendFile(filePath);
})

App.get("/gigdc",(req,res)=>
{
    console.log("개망!");
})

const httpServer : Server = App.listen(9090,()=>
{
    console.log(`Server is running on 9090 port`);
})