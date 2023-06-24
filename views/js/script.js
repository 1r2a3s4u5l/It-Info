async function getAuthors() {
  const loginUrl = "/login";

  let accessToken = localStorage.getItem("accessToken");
  console.log("accessToken:", accessToken);
  const accessTokenExpTime = getTokenExpiration(accessToken);
  console.log("accessTokenExpTime:", accessTokenExpTime);
  if (accessTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accessTokenExpTime) {
      console.log("Access token is still valid.");
    } else {
      console.log("Access token has expired.");
      const refreshToken = getTokenFromCookie("refreshToken");
      console.log("refreshToken:", refreshToken);
      const refreshTokenExpTime = getTokenExpiration(refreshToken);
      console.log("refreshTokenExpTime: ", refreshTokenExpTime);
      if (refreshTokenExpTime) {
        const currentTime = new Date();
        if (currentTime < refreshTokenExpTime) {
          console.log("Refresh token is still valid.");
          accessToken = await refreshTokenFunc(refreshToken);
          console.log("NewAccessToken:", accessToken);
        } else {
          console.log("Refresh token has expired.");
          return window.location.replace(loginUrl);
        }
      } else {
        console.log("Invalid access token format.");
      }
    }
  } else {
    console.log("Invalid access token format.");
  }

  fetch("http://localhost:3333/api/author", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Request failed with status: " + response.status);
      }
    })
    .then((author) => {
      console.log(author.data);
      displayAuthors(author.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  if (decodedToken && decodedToken.exp) {
    return new Date(decodedToken.exp * 1000); // Convert expiration time from seconds to milliseconds
  }
  return null;
}

function getTokenFromCookie(cookieName) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${cookieName}=`)) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}

async function refreshTokenFunc() {
  return fetch("http://localhost:3333/api/author/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Refreshed successful");
        return response.json();
      } else {
        console.error("Refreshing failed");
      }
    })
    .then((tokens) => {
      console.log(tokens.accessToken);
      localStorage.setItem("accessToken", tokens.accessToken);
      return tokens.accessToken;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayAuthors(authors) {
  const listContainer = document.getElementById("author-list");

  listContainer.innerHTML = "";

  authors.forEach((author) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${author.author_first_name} ${author.author_last_name} \
    - ${author.author_email}`;
    listContainer.appendChild(listItem);
  });
}
