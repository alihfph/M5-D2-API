

import express from "express" 
import fs from "fs"
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import uniqid from "uniqid" 
import { check, validationResult } from "express-validator"

const router = express.Router()

const filename = fileURLToPath(import.meta.url)

const studentsJSONPath = join(dirname(filename), "students.json") 

const getStudents = () => {
  const buf = fs.readFileSync(join(__dirname, "students.json"))
  return JSON.parse(buf.toString())
}

router.get("/", (req, res, next) => {
  try {
    console.log("GET ROUTE")
  const fileAsABuffer = fs.readFileSync(studentsJSONPath)

  const fileAsAString = fileAsABuffer.toString() 

  const fileAsAJSON = JSON.parse(fileAsAString) 
  if (req.query && req.query.name) {
    const filteredStudents = fileAsAJSON.filter(student => student.hasOwnProperty("name") && student.name === req.query.name)
  res.send(filteredStudents)} else {
    res.send(fileAsAJSON)
  } 
    
  } catch (err) {
    console.log(err)
    next(error) 
  }
  
})

router.get("/:identifier",  (req, res, next) => {
  try {
    console.log("UNIQUE IDENTIFIER: ", req.params.identifier)
  const fileAsABuffer = fs.readFileSync(studentsJSONPath) 

  const fileAsAString = fileAsABuffer.toString()

  const students = JSON.parse(fileAsAString)

  const student = students.find(s => s.ID === req.params.identifier)
  res.send(student)
  }
    
   catch (err) {
    console.log(err)
    next(err)
    
  }
  
})

router.post("/",
 [check("Description").exists().withMessage("Please describe the proejct"), check("RepoURL").exists().withMessage("Url is mondatory")], (req, res, next) => {
  try {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        const err = new Error()
        err.errorList = errors
        err.httpStatusCode = 400
    
    } else {
    const fileAsABuffer = fs.readFileSync(studentsJSONPath) 

  const fileAsAString = fileAsABuffer.toString() 

  const students = JSON.parse(fileAsAString)

 
  const newStudent = req.body
  newStudent.ID = uniqid()

 

  students.push(newStudent)

  

  fs.writeFileSync(studentsJSONPath, JSON.stringify(students))

 

  res.status(201).send({ id: newStudent.ID })
    }
  } catch (err) {
    error.httpStatusCode = 500
    next(error)
    
  }
  
})

router.put("/:id", (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err)
  }
 

  
})

router.delete("/:id", (req, res, next) => {
  try {
    const fileAsABuffer = fs.readFileSync(studentsJSONPath) 

  const fileAsAString = fileAsABuffer.toString()

  const students = JSON.parse(fileAsAString)
 

  const newStudentsArray = students.filter(student => student.ID !== req.params.id)

 

  fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

  res.status(204).send()
    
  } catch (err) {
    console.log(err)
  }

  
})

export default router 