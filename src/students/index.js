

import express from "express" 
import fs from "fs"
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import uniqid from "uniqid" 

const router = express.Router()

const filename = fileURLToPath(import.meta.url)

const studentsJSONPath = join(dirname(filename), "students.json") 

router.get("/", (req, res) => {
  console.log("GET ROUTE")
  const fileAsABuffer = fs.readFileSync(studentsJSONPath)

  const fileAsAString = fileAsABuffer.toString() 

  const fileAsAJSON = JSON.parse(fileAsAString) 
  res.send(fileAsAJSON) 
})

router.get("/:identifier", (req, res) => {
  console.log("UNIQUE IDENTIFIER: ", req.params.identifier)
  const fileAsABuffer = fs.readFileSync(studentsJSONPath) 

  const fileAsAString = fileAsABuffer.toString()

  const students = JSON.parse(fileAsAString)

  const student = students.find(s => s.ID === req.params.identifier)
  res.send(student)
})

router.post("/", (req, res) => {
  
  const fileAsABuffer = fs.readFileSync(studentsJSONPath) 

  const fileAsAString = fileAsABuffer.toString() 

  const students = JSON.parse(fileAsAString)

 
  const newStudent = req.body
  newStudent.ID = uniqid()

 

  students.push(newStudent)

  

  fs.writeFileSync(studentsJSONPath, JSON.stringify(students))

 

  res.status(201).send({ id: newStudent.ID })
})

router.put("/:id", (req, res) => {
 

  const fileAsABuffer = fs.readFileSync(studentsJSONPath) 
  console.log("UNIQUE IDENTIFIER: ", req.params.id)
  

  const fileAsAString = fileAsABuffer.toString() 

  const students = JSON.parse(fileAsAString)



  const newStudentsArray = students.filter(s => s.ID !== req.params.id)
  const modifiedUser = req.body
  modifiedUser.ID = req.params.id

  newStudentsArray.push(modifiedUser)

  

  fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

  
  res.send({ id: modifiedUser.ID })
})

router.delete("/:id", (req, res) => {

  const fileAsABuffer = fs.readFileSync(studentsJSONPath) 

  const fileAsAString = fileAsABuffer.toString()

  const students = JSON.parse(fileAsAString)
 

  const newStudentsArray = students.filter(student => student.ID !== req.params.id)

 

  fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

  res.status(204).send()
})

export default router 