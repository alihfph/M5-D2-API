import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import studentsRoutes from "./students/index.js"

const server = express()
const port = 3000

server.use(cors())
server.use(express.json()) 
server.use("/students", studentsRoutes)


console.log(listEndpoints(server))
server.listen(port, () => {
  console.log("Server is running on port ", port)
})