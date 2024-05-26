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
        db.query(`SELECT * FROM products WHERE dateOfSale LIKE '%${req.query.month}%' AND (title LIKE '%${data}%' OR description LIKE '%${data}%' OR price LIKE '%${data}%')`, (error,result,fields)=>{
            if(error){
                throw error
            }
            const numberOfProducts = result.length;
            const numberOfPages = Math.ceil(numberOfProducts / productsPerPage);
            let page = req.query.page;
            const strtingLimit = (page - 1) * productsPerPage;
            const q = `SELECT * FROM products WHERE dateOfSale LIKE '%${req.query.month}%' AND (title LIKE '%${data}%' OR description LIKE '%${data}%' OR price LIKE '%${data}%') LIMIT ${strtingLimit}, ${productsPerPage}`;
            db.query(q, (error, products) => {
                resp.send({"result" : products, "numberOfPages": numberOfPages})
            })
        })
    }else{
        db.query(`SELECT * FROM products WHERE dateOfSale LIKE '%${req.query.month}%'`, (error,result,fields)=>{
            if(error){
                throw error
            }
            const numberOfProducts = result.length;
            const numberOfPages = Math.ceil(numberOfProducts / productsPerPage);
            let page = req.query.page;
            const strtingLimit = (page - 1) * productsPerPage;
            const q = `SELECT * FROM products WHERE dateOfSale LIKE '%${req.query.month}%' LIMIT ${strtingLimit}, ${productsPerPage}`;
            db.query(q, (error, products) => {
                resp.send({"result" : products, "numberOfPages": numberOfPages})
            })
        })
    }
})

app.get('/statistics', (req, resp)=>{
    const month = req.query.month;
    const q = `SELECT COUNT(CASE WHEN dateOfSale LIKE '%-${month}-%' THEN 1 END) AS total_sale, COUNT(CASE WHEN dateOfSale LIKE '%-${month}-%' AND sold = 1 THEN 1 END) AS total_sold, COUNT(CASE WHEN dateOfSale LIKE '%-${month}-%' AND sold = 0 THEN 1 END) AS total_unsold FROM products;`;
    db.query(q, (error, result)=>{
        if(error) throw error
        resp.send(result);
    })
})

// get category count
app.get('/categories', (req, resp)=>{
    const month = req.query.month;
    const q = `SELECT category, COUNT(id) AS items FROM products WHERE dateOfSale LIKE '%-${month}-%'GROUP BY category;`;
    db.query(q, (error, result) => {
        if(error) throw error
        resp.send(result)
    })
})

// get products by range
app.get('/chart', (req, resp)=>{
    const month = req.query.month;
    const q = `SELECT * FROM products WHERE dateOfSale LIKE '%-${month}-%';`;
    db.query(q, (error, results)=>{
        if(error){
            throw error
        }
        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0
        };
        results.forEach(row => {
            const price = row.price;
            if (price >= 0 && price <= 100) {
                priceRanges['0-100']++;
            } else if (price >= 101 && price <= 200) {
                priceRanges['101-200']++;
            } else if (price >= 201 && price <= 300) {
                priceRanges['201-300']++;
            } else if (price >= 301 && price <= 400) {
                priceRanges['301-400']++;
            } else if (price >= 401 && price <= 500) {
                priceRanges['401-500']++;
            } else if (price >= 501 && price <= 600) {
                priceRanges['501-600']++;
            } else if (price >= 601 && price <= 700) {
                priceRanges['601-700']++;
            } else if (price >= 701 && price <= 800) {
                priceRanges['701-800']++;
            } else if (price >= 801 && price <= 900) {
                priceRanges['801-900']++;
            } else {
                priceRanges['901-above']++;
            }
        });
        const result = Object.entries(priceRanges).map(([priceRange, count]) => ({
            range: priceRange,
            items: count
        }));
        resp.json(result);
    })
})
app.listen(port, ()=>{
    console.log('listening')
    getExternalData()
})