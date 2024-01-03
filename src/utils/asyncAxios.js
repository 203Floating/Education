import axios from 'axios'

export const useGetData = (url, params) => {
  const token = sessionStorage.getItem('token')
  const baseHeaders = {
    Authorization: token
  }

  return axios.get(url, {
    params: params,
    headers: baseHeaders
  })
}

export const usePostData = (url, params) => {
  const token = sessionStorage.getItem('token')
  const baseHeaders = {
    Authorization: token
  }

  return axios.post(url, params, {
    headers: baseHeaders
  })
}

export const useDeleteData = (url, params) => {
  const token = sessionStorage.getItem('token')
  const baseHeaders = {
    Authorization: token
  }

  return axios.delete(url, {
    params: params,
    headers: baseHeaders
  })
}

export const uselogin = async (username, password) => {
  try {
    const res = await axios.post('http://localhost:3000/users', {
      username: username,
      password: password
    })
    return res.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
