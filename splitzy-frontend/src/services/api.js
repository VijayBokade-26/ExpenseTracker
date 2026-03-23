const BASE_URL = "http://127.0.0.1:8000";

export const signupUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const loginUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const getUser = async () => {
    const token =localStorage.getItem("token")

    const response = await fetch(
        "http://127.0.0.1:8000/api",
        {
            method : "GET",
            headers : {"Authorization":`Bearer ${token}`,},       
        }

    );
    return response.json()

};
