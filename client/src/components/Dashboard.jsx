import React, { useEffect, useState } from "react";
import axios from 'axios'

function Dashboard(){
    const [data, setData] = useState([]);
    const [month, setMonth] = useState("March");
    const [numberOfPages, setNumberOfPages] = useState();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(()=>{
        //GET Api data
        axios.get(`http://localhost:5000/all`, {params: { search: search, page: page}})
        .then((res) => {
            setData(res.data.result);
            setNumberOfPages(res.data.numberOfPages)
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
                    <input type="search" placeholder="Search Transactions" onChange={(event)=>{if(event.target.value == "") setSearch("")}} />
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
            <nav aria-label="Page navigation example">
                <div className="float-end">
                    <h6>Per Page : {data.length}</h6>
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
            </nav>
        </div>
    )
}

export default Dashboard