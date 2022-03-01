import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import './Register.styles.css'

function App() {
	const history = useHistory()

	const [name, setName] = useState('')
	const [mobile, setMobile] = useState('')
	const [address, setAddress] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	async function registerUser(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:1337/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				password,
				mobile,
				address,
			}),
		})

		const data = await response.json()

		if (data.status === 'ok') {
			history.push('/login')
		}
	}

	return (
		<div className='register_page'>
			<h1>Nemesis Register</h1>
			<form onSubmit={registerUser}>
				<input
					className='form-control'
					value={name}
					onChange={(e) => setName(e.target.value)}
					type="text"
					placeholder="Name"
					required
				/>
				<br />
				<input
					className='form-control'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
					required
				/>
				<br />
				<input
					className='form-control'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
					required
				/>
				<br />
				<input
					className='form-control'
					value={mobile}
					onChange={(e) => setMobile(e.target.value)}
					type="mobile"
					placeholder="Mobile Number"
					required
				/>
				<br />
				<input
					className='form-control'
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					type="text"
					placeholder="Address"
					required
				/>
				<br />
				<input type="submit" value="Register" className='btn btn-primary' />
			</form>
		</div>
	)
}

export default App
