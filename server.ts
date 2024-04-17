const port=process.env.PORT
import init from "./app"
init().then(app=>{
    app.listen(port,()=>{
        console.log(`server is listening on port ${port}`)
    })
})