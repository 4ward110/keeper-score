
var button = document.getElementById('addRow');
button.addEventListener("click", () => {
    var newScoreBox = document.createElement('tr');
    newScoreBox.innerHTML = "<th scope='row'>1</th>"+
    `<td><input type='number' value='0'/></td>`+
    "<td><input type='number' value='0'/></td>"+
    "<td><input type='number' value='0'/></td>"+
    "<td><input type='number' value='0'/></td>"
    document.getElementById("body").appendChild(newScoreBox);
    console.log(document.cookie)
});
