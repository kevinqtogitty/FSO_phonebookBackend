const mongoose = require('mongoose')
const password = encodeURIComponent("")

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const url = `mongodb+srv://phonebook:${password}@cluster0.hvsc2ya.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
        if (process.argv.length > 3 ) {
            const personName = process.argv[3]
            const number = process.argv[4]

            const person = new Person({
                id: 1,
                name: personName,
                number: number
        })

            console.log(`added ${personName} number ${number} to phonebook`)
            return person.save()
        } else {
            Person.find({}).then(result => {
                result.forEach(person => {
                  console.log(person)
                })
                mongoose.connection.close()
              })
        }

    })
    .then(() => {
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))