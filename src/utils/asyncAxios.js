import axios from 'axios'

export const useGetData = (url, params, headers) => {
  return axios.get(url, {
    params: params,
    headers: headers
  })
}

export const usePostData = (url, params, headers) => {
  return axios.post(url, params, {
    headers: headers
  })
}

export const useDeleteData = (url, params, headers) => {
  return axios.delete(url, { params: params, headers: headers })
}

export const uselogin = async (username, password) => {
  try {
    const res = await axios.post('http://localhost:3000/users', {
      // 使用相对路径
      username: username,
      password: password
    })
    return res.data
  } catch (error) {
    console.error('Error:', error) // 输出错误信息
    throw error // 抛出错误，以便在调用方捕获
  }
}
