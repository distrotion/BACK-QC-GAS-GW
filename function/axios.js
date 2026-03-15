const axios = require('axios')

const instance = axios.create({
  timeout: 30000,
  headers: { 'Connection': 'keep-alive' }
})

exports.post = async (url, body) => {
  try {
    const res = await instance.post(url, body)
    return res.data
  } catch (error) {
    console.error(error?.response?.status ?? error.message)
    return error?.response?.status ?? null
  }
}

exports.get = async (url) => {
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    console.error(error?.response?.status ?? error.message)
    return error?.response?.status ?? null
  }
}
