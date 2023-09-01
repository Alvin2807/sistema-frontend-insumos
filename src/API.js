import axios from "axios";

export default axios.create({
  baseURL: "http://localhost/backend/public/api",
  headers: {
    "Content-type": "application/json"
  }
});