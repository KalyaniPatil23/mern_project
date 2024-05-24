const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())

const port = 5000
const productsPerPage = 10;
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
                        const dateOfSale = element.dateOfSale
                        db.query('insert into products values(?,?,?,?,?,?,?,?)', [id, title, price, description, category, image, sold, dateOfSale], (err, data) =>{
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

app.get('/all', function(req, resp){
    const data = req.query.search
    if(data){
        db.query(`SELECT * FROM products WHERE title LIKE '%${data}%' OR description LIKE '%${data}%' OR price LIKE '%${data}%'`, (error,result,fields)=>{
            if(error){
                throw error
            }
            const numberOfProducts = result.length;
            const numberOfPages = Math.ceil(numberOfProducts / productsPerPage);
            let page = req.query.page;
            const strtingLimit = (page - 1) * productsPerPage;
            db.query(`SELECT * FROM products WHERE title LIKE '%${data}%' OR description LIKE '%${data}%' OR price LIKE '%${data}%' LIMIT ${strtingLimit}, ${productsPerPage}`, (error, products) => {
                resp.send({"result" : products, "numberOfPages": numberOfPages})
            })
        })
    }else{
        db.query(`SELECT * FROM products`, (error,result,fields)=>{
            if(error){
                throw error
            }
            const numberOfProducts = result.length;
            const numberOfPages = Math.ceil(numberOfProducts / productsPerPage);
            let page = req.query.page;
            const strtingLimit = (page - 1) * productsPerPage;
            db.query(`SELECT * FROM products LIMIT ${strtingLimit}, ${productsPerPage}`, (error, products) => {
                resp.send({"result" : products, "numberOfPages": numberOfPages})
            })
        })
    }
})
app.listen(port, ()=>{
    console.log('listening')
    getExternalData()
})