
import express from "express" //3rd party module
import fs from "fs" // core module
import { fileURLToPath } from "url" // core module
import { dirname, join } from "path" // core module
import uniqid from "uniqid" //3rd party module to create unique identifiers

const router = express.Router()

const filename = fileURLToPath(import.meta.url)

// console.log("CURRENT FILE PATH: ", filename)
// console.log("CURRENT DIR PATH: ", dirname(filename))

// const studentsJSONPath = "C:\Strive\FullStack\2021\Feb21\M5\Day2\src\students\students.json" // static path is a terrible idea
// /src/students/students.json on UNIX
const studentsJSONPath = join(dirname(filename), "students.json") // DO NOT CONCATENATE PATHS LIKE CONCATENATING STRINGS e.g. dirname(filename) + "/students.json", USE PATH.JOIN()

// console.log("STUDENTS.JSON PATH: ", studentsJSONPath)

router.get("/", (req, res) => {
  console.log("GET ROUTE")
  // const fileAsABuffer = fs.readFileSync(studentsJSONPath) // returns a buffer (machine readable, not human readable)

  // const fileAsAString = fileAsABuffer.toString() // returns a string from a buffer

  // const fileAsAJSON = JSON.parse(fileAsAString) // converts string into JSON
  // res.send(fileAsAJSON) // sends the json as response
})

router.get("/:identifier", (req, res) => {
  console.log("UNIQUE IDENTIFIER: ", req.params.identifier)
  const fileAsABuffer = fs.readFileSync(studentsJSONPath) // returns a buffer (machine readable, not human readable)

  const fileAsAString = fileAsABuffer.toString() // returns a string from a buffer

  const students = JSON.parse(fileAsAString)

  const student = students.find(s => s.ID === parseInt(req.params.identifier))
  res.send(student)
})

router.post("/", (req, res) => {
  // 1. read the old content of the file
  const fileAsABuffer = fs.readFileSync(studentsJSONPath) // returns a buffer (machine readable, not human readable)

  const fileAsAString = fileAsABuffer.toString() // returns a string from a buffer

  const students = JSON.parse(fileAsAString)

  // 2.1 extract the req. body and create an unique id for him/her
  const newStudent = req.body
  newStudent.ID = uniqid()

  // 2.2 push the new student to array

  students.push(newStudent)

  // 3. replace old content in the file with new array

  fs.writeFileSync(studentsJSONPath, JSON.stringify(students))

  // 4. send back a proper response

  res.status(201).send({ id: newStudent.ID })
})

router.put("/:id", (req, res) => {
  // 1. read the old content of the file

  const fileAsABuffer = fs.readFileSync(studentsJSONPath) // returns a buffer (machine readable, not human readable)

  const fileAsAString = fileAsABuffer.toString() // returns a string from a buffer

  const students = JSON.parse(fileAsAString)

  // 2. modify the specified student

  const newStudentsArray = students.filter(student => student.ID !== req.params.id)

  const modifiedUser = req.body
  modifiedUser.ID = req.params.id

  newStudentsArray.push(modifiedUser)

  // 3. save the file with the updated content

  fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

  // 4. send back a proper response
  res.send({ data: "HELLO FROM PUT ROUTE!" })
})

router.delete("/:id", (req, res) => {
  // 1. read the old content of the file
  const fileAsABuffer = fs.readFileSync(studentsJSONPath) // returns a buffer (machine readable, not human readable)

  const fileAsAString = fileAsABuffer.toString() // returns a string from a buffer

  const students = JSON.parse(fileAsAString)
  // 2. filter out the user the specified id

  const newStudentsArray = students.filter(student => student.ID !== req.params.id)

  // 3. save the file with the new content

  fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

  // 4. send back a proper response
  res.status(204).send()
})

export default router // do not forget about this!!!!!!!!!!!