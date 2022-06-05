import axios from "axios";

export default axios.create({
  baseURL: "https://prioritaskapi.herokuapp.com//api",
  //baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json"
  }
});