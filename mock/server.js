// dis
import jsonServer from 'json-server'
import jsonwebtoken from 'jsonwebtoken'
import bodyParser from 'body-parser'
const server = jsonServer.create()
const router = jsonServer.router('./mock/db.json')
const middlewares = jsonServer.defaults()
const rewrite = jsonServer.rewriter({
    '/api/*': '/$1',
})
server.use(bodyParser.json())
const SECRET_KEY = '1441341234'
function createJwt(payload) {
    const expiresIn = '1h'
    return jsonwebtoken.sign(payload, SECRET_KEY, { expiresIn })
}
server.use(rewrite)
server.use(middlewares)
server.post('/users/loginByPhoneNumber', (req, res) => {
    console.log(111)
    const { phoneNumber, veriCode } = req.body
    const accessToken = createJwt({ phoneNumber, veriCode })
    res.status(200).json({ data: { token: accessToken } })
})
server.use('/works', (req, res, next) => {
    const errorResp = {
        errno: '12001',
        message: '登录校验失败',
    }
    const authHeader = req.headers.authorization
    console.log(111)
    if (!authHeader) {
        res.json(errorResp)
        return
    }
    try {
        const token = authHeader.split(' ')[1]
        jsonwebtoken.verify(token, SECRET_KEY)
        next()
    } catch (e) {
        res.json(errorResp)
    }
})
server.use(router)
router.render = (_req, res) => {
    res.jsonp({
        errno: 0,
        data: {
            list: res.locals.data,
            count: res.locals.data.length,
        },
    })
}
server.listen(3000, () => {
    console.log('JSON Server is running')
})
