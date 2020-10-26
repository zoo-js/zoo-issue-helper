import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://raw.githubusercontent.com/zoo-js/zoo-data/main/json/',
  timeout: 3000,
});

export default HTTP;
