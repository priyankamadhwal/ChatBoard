import axios from "axios";
const apiBaseURL = "http://localhost:8000";

export const GET = (url, header, callback, errorcallback) => {
  return axios
    .get(`${apiBaseURL}/${url}`, {
      headers: header,
    })
    .then((response) => {
      if (callback) callback(response);
    })
    .catch((err) => {
      if (errorcallback) errorcallback(err);
    });
};

export const POST = (url, data, header, callback, errorcallback) => {
  return axios
    .post(`${apiBaseURL}/${url}`, data, {
      headers: header,
    })
    .then((response) => {
      if (callback) callback(response);
    })
    .catch((err) => {
      if (errorcallback) errorcallback(err);
    });
};
