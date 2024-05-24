import React, { useEffect, useState } from "react";
import axios from 'axios'

function Dashboard(){
    const [data, setData] = useState([]);
    const [month, setMonth] = useState("March");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(()=>{
        //GET Api data
        axios.get(`http://localhost:5000/all`, {params: { search: search}})
        .then((res) => {
            setData(res.data);
        })
        .catch((err)=>console.log(err))
    }, [page, month, search])

    const searchData = (event) =>{
        setSearch(event.target[0].value)
        event.preventDefault();
    }
    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-6">
                    <form onSubmit={searchData}>
                    <input type="text" placeholder="Search Transactions" />
                    </form>
                </div>
            </div>
            <table className="table table-striped">
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
                        data.map((product) => {
                            return(
                                <tr>
                                    <td>{product.id}</td>
                                    <td>{product.title}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.sold}</td>
                                    <td>{product.image}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard