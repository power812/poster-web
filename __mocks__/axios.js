const axios = {
    get: jest.fn(() => Promise.resolve({ data: { username: 'power' } }))

}
module.exports = axios