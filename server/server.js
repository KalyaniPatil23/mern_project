const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())

const port = 5000

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mern_project"
})

function getExternalData() {
    let url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    fetch(url).then((res) => {
        res.json().then((resp) => {
            db.query('delete from products', (err, result) => {
                if(err){
                    console.log(err)
                }else{
                     //add data into table
                    resp.forEach(element => {
                        const id = element.id
                        const title = element.title
                        const price = element.price
                        const description = element.description
                        const category = element.category
                        const image = element.image
                        const sold = element.sold
                        const dateOfSold = element.dateOfSold
                        db.query('insert into products values(?,?,?,?,?,?,?,?)', [id, title, price, description, category, image, sold, dateOfSold], (err, data) =>{
                            if(err){
                                console.log(err)
                            }else{
                                console.log("Data inserted successfully.")
                            }
                        })
                    });
                }
            })
           
        })
    })
}
app.listen(port, ()=>{
    console.log('listening')
    getExternalData()
})