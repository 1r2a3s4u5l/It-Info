async function getAuthors() {
  // sessionStorage.setItem()
  localStorage.setItem(
    "accessToken",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTE0ZGVhYzAyY2NiM2RmNTI2MGJhNSIsImlzX2V4cGVydCI6dHJ1ZSwiYXV0aG9yUm9sZXMiOlsiUkVBRCIsIldSSVRFIl0sImlhdCI6MTY4NzUwMjYzNSwiZXhwIjoxNjkyNjg2NjM1fQ.aS15bHYZS8CjcBtHt8_T1C6tYcXq7EatDePZu3t0OSQ"
  );
  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);

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
      console.error("Error", error);
    });
}

function displayAuthors(authors) {
  const listContainer = document.getElementById("author-list");

  listContainer.innerHTML = "";

  authors.forEach((author) => {
    const listenItem = document.createElement("li");
    listenItem.textContent = `${author.author_first_name} ${author.author_last_name} \
         - ${author.author_email}`;
    listContainer.appendChild(listenItem);
  });
}
