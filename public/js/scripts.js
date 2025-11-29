// alert("Script file successfully accessed!")
//event listeners
let authorLinks = document.querySelectorAll("a");
for (authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}



async function getAuthorInfo() {
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `<h1> ${data[0].firstName} ${data[0].lastName} </h1>
                            <b>Country: </b> ${data[0].country} <br>
                            <b>Born:</b> ${data[0].dob} <br>
                            <b>Died: </b> ${data[0].dod} <br><br>
                                 `;
    authorInfo.innerHTML += `<img src="${data[0].portrait}" width="200"><br>`;
    authorInfo.innerHTML += `<b>Biography: </b> ${data[0].biography}`
    
}

// function searchByLikes() {
//     likesLow = document.querySelector("#likesLow").value;
//     likesHigh = document.querySelector("#likesHigh").value;
// }