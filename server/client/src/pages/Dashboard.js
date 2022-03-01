import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import './Dashboard.styles.css'

const Dashboard = () => {
	const history = useHistory()
	const [userList, setUserList] = useState([])
	useEffect(() => {
		Axios.get('http://localhost:1337/api/read').then((response) => {
			setUserList(response.data)
		})
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/login')
			}

		}
	})
	const deleteUser = (id) => {
		Axios.delete(`http://localhost:1337/api/delete/${id}`)
	}

	return (
		<div>
			<h2 className='center'>User List</h2>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Mobile Number</th>
						<th>Address</th>
						<th>Delete</th>
					</tr>
				</thead>
				{userList.map((val, key) => {
					return <tbody key={key}>
						<tr>
							<td>{val.name}</td>
							<td>{val.email}</td>
							<td>{val.mobile}</td>
							<td>{val.address}</td>
							<td><button className='btn btn-danger' onClick={() => deleteUser(val._id)}>Delete</button></td>
						</tr>
					</tbody>
				})}
			</table>
		</div>
	)
}

export default Dashboard
