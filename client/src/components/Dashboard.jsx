import React, { useEffect, useState } from "react";
import axios from 'axios'
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis} from "recharts";

const months = [
    {
        name: "January",
        value: "01"
    },
    {
        name: "February",
        value: "02"
    },
    {
        name: "March",
        value: "03"
    },
    {
        name: "April",
        value: "04"
    },
    {
        name: "May",
        value: "05"
    },
    {
        name: "June",
        value: "06"
    },
    {
        name: "July",
        value: "07"
    },
    {
        name: "August",
        value: "08"
    },
    {
        name: "September",
        value: "09"
    },
    {
        name: "Octomber",
        value: "10"
    },
    {
        name: "November",
        value: "11"
    },
    {
        name: "December",
        value: "12"
    }
]
function Dashboard(){
    const [data, setData] = useState({transactions: []});
    const [month, setMonth] = useState({name: "March", value: "03"});
    const [numberOfPages, setNumberOfPages] = useState();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [monthlySaleData, setMonthlySaleData] = useState({});
    const [productRange, setProductRange] = useState([]);

    useEffect(()=>{
        //GET Api data
        axios.get(`http://localhost:5000/all`, {params: { search: search, page: page, month: month.value}})
        .then((res) => {
            setData({...data, transactions: res.data.result});
            setNumberOfPages(res.data.numberOfPages)
            saleData();
            chartData();
        })
        .catch((err)=>(err))
    }, [page, search, month])

    const saleData = ()=>{
        setPage(1);
        //GET Api data
        axios.get(`http://localhost:5000/chart`, {params: { month: month.value}})
        .then((res) => {
            setProductRange(res.data)
        })
        .catch((err)=>console.log(err))
    }

    const chartData = ()=>{
        setPage(1);
        //GET Api data
        axios.get(`http://localhost:5000/statistics`, {params: { month: month.value}})
        .then((res) => {
           setMonthlySaleData(res.data[0])
        })
        .catch((err)=>console.log(err))
    }
    const searchData = (event) =>{
        setSearch(event.target[0].value)
        setPage(1);
        event.preventDefault();
    }

    const selectMonth = (event) => {
        let m = months.find((ele)=> event.target.value === ele.value)
        setMonth(m);
    }

    return(
        <div className="container-fluid" style={{padding: "30px"}}>
            <div>
                <div className="row">
                    <div className="col-6">
                        <form onSubmit={searchData}>
                        <input type="search" placeholder="Search Transactions" onChange={(event)=>{if(event.target.value == "") {setSearch(""); setPage(1)}}} />
                        </form>
                    </div>
                    <div className="col-6">
                    <select name="months" id="months" value={month.value} onChange={selectMonth} className="float-end">
                        {
                            months.map((m)=> (
                                <option value={m.value}>{m.name}</option>
                            ))
                        }
                    </select>
                    </div>
                </div>
                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Title</td>
                            <td>Description</td>
                            <td>Price</td>
                            <td>Category</td>
                            <td>Sold</td>
                            <td>Image</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.transactions.map((product) => {
                                return(
                                    <tr>
                                        <td>{product.id}</td>
                                        <td>{product.title}</td>
                                        <td>{product.description}</td>
                                        <td>{product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.sold}</td>
                                        <td><img src={product.image} alt="product" style={{width: "100px", height: "100px"}}/></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                {numberOfPages > 1 && 
                <nav aria-label="Page navigation example">
                    <div className="float-end">
                        <h6>Per Page : {data.transactions.length}</h6>
                    </div>
                    <ul class="pagination justify-content-center">
                        <li className={page > 1 ? "page-item" : "page-item disabled"}>
                        <a class="page-link" href="#" tabindex="-1" aria-disabled="true" onClick={()=>{if(page > 1) setPage(page-1)}}>Previous</a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">{page}</a></li>
                        <li className={page < numberOfPages ? "page-item" : "page-item disabled"}>
                            <a className="page-link" href="#" onClick={()=>{if(page < numberOfPages) setPage(page+1)}}>Next</a>
                        </li>
                    </ul>
                </nav>}
            </div>
            <div className="row" style={{marginTop: "40px"}}>
                <div className="col-3">
                    <h5>Statistic - {month.name}</h5>
                    <div class="card" style={{width: "16rem", background: "#F8DF8C"}}>
                    <div class="card-body">
                    <table style={{width: '80%'}}>
                        <tbody>
                            <tr>
                                <td>
                                    <p>Total sale</p>
                                </td>
                                <td>
                                    {monthlySaleData.total_sale}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Total sold item</p>
                                </td>
                                <td>
                                    {monthlySaleData.total_sold}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>
                                        Total not sold item
                                    </p>
                                </td>
                                <td>
                                    <p>{monthlySaleData.total_unsold}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
                </div>
                <div className="col-9 p-4" style={{background: "#EDF6F6"}}>
                    <h5>Bar Chart Stats - {month.name}</h5>
                    <ResponsiveContainer aspect={3} className={"mt-4"}>
                        <BarChart data={productRange}>
                            <XAxis dataKey="range"/>
                            <YAxis/>
                            <Bar dataKey="items" fill="#6CE5E8"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
        </div>
    )
}

export default Dashboard