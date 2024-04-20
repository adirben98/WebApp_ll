
import init from "./app"
const port = process.env.PORT 
init().then(app=>{
    app.listen(port,()=>{
        console.log(`server is listening on port ${port}`)
    })
})