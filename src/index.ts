import express from "express";
import { initRoutes } from "./routes/routes";
import { AppDataSource } from "./database/database";

const main = async () => {
    const app = express()
    const port = 3006

    try {
        
        var cors = require('cors')
        app.use(cors()) // Use this after the variable declaration
        await AppDataSource.initialize()
        console.error("well connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot contact database")
        process.exit(1)
    }
    app.use(cors());
   

    app.use(express.json())
    
    //swaggerDocs(app, port)

    initRoutes(app)
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

main()