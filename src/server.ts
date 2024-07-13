import init from "./app"
const port = process.env.PORT
import io from "./socket_server";

init().then(server=>{
    io(server)
    server.listen(port,()=>{
        console.log(`server is listening on port ${port}`)
    })
})