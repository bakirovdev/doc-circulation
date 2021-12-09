const express = require('express')
const { sequelize } = require('./models')
const dotenv = require('dotenv').config()
const AuthController = require('./controllers/AuthController')
const app = express()
const cors = require('cors')
var server = require('http').Server(app);
const auth = require('./middleware/auth')

const bodyParser = require('body-parser');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

app.use(express.static(__dirname + '/uploads'));
app.use('/uploads', express.static('uploads'));
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(express.json())
app.use(cors())

const user_routes = require('./routes/user.routes')
const type_routes = require('./routes/documentType.routes')
const document_circulation = require('./routes/documentCirculation.routes')
// const profile_message_routes = require('./routes/profile_message.routes')

app.use('/api/users', user_routes)
app.use('/api/types', auth, type_routes)
app.use('/api/documents', auth, document_circulation)
// app.use('/api/profile_messages', profile_message_routes)


app.listen(process.env.NODE_PORT, "192.168.13.11", async () => {
    try {
        await sequelize.authenticate()
    } catch (error) {
        console.log('Error occured while syncing models with database', error)
    }
    console.log(`Server is running on ${process.env.NODE_PORT} PORT`);
})