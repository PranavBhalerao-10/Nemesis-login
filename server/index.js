
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const expressValidator = require('express-validator')
const { check } = require('express-validator')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')

app.post('/api/register', [
	check('email', "Email isn't valid").isEmail(),
	check('mobile', "Enter 10 digit number").isLength({ min: 10, max: 10 }),
	check('name', "Only number and alphabets allowed").isAlphanumeric(),
	check('name', "No spaces allowed").contains(' '),
], async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
			mobile: req.body.mobile,
			address: req.body.address,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: err })
	}
})

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123', { expiresIn: '5m' }
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})

app.get('/api/read', (req, res) => {
	User.find({}, (err, result) => {
		if (err) {
			res.send(err)
		}
		res.send(result)
	})
})

app.delete('/api/delete/:id', async (req, res) => {
	const id = req.params.id
	await User.findByIdAndDelete(id).exec()
	res.send('deleted')
})

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('../client/build'))
}

app.listen(1337, () => {
	console.log('Server started on 1337')
})
