const apiBase = "https://localhost:7028/api/User";

export const fetchEmployees = () =>
  fetch(`${apiBase}/get-all`).then((response) => response.json());

export const fetchEmployeeById = (id) =>
  fetch(`${apiBase}/userinfo?id=${id}`).then((response) => response.json());

export const createEmployee = (employee) =>
  fetch(`${apiBase}/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  }).then((response) => response.json());

export const updateEmployee = (employee) =>
  fetch(`${apiBase}/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  }).then((response) => response.json());

export const deleteEmployee = (id) =>
  fetch(`${apiBase}/delete?id=${id}`, {
    method: "DELETE",
  }).then((response) => response.json());
