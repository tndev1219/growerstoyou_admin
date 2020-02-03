import axios from 'axios';

const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('id_token') || undefined,
  }
}

const BASE_URL = 'http://166.88.19.232:5000/apis/'

const POST = (url, params) => {
  return axios.post(`${BASE_URL}${url}`, params, config)
}
const PUT = (url, params) => {
  return axios.put(`${BASE_URL}${url}`, params, config)
}
const GET = (url, params) => {
  return axios.get(`${BASE_URL}${url}?${dictToURI(params)}`, config)
}

const dictToURI = (dict) => {
  var str = [];
  for(var p in dict){
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dict[p]));
  }
  return str.join("&");
}

export default {
  POST,
  GET,
  PUT,
}