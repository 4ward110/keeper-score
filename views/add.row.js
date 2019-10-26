var changeValue = document.getElementsByTagName("input");
for (let i = 0; i < changeValue.length; i++){
    changeValue[i].addEventListener("input",() => {
        $.ajax({
            url:'/changeScore',
            method: "POST",
            contentType:"application/json",
            data: JSON.stringify({ value: changeValue[i].value, 
                                   name: changeValue[i].name, 
                                   id: changeValue[i].id}),
            success: (response) => {
                var allElement = document.querySelectorAll("th#score");
                for( let i = 0; i< response.totalScore.length; i++) {
                    allElement[i].innerHTML = response.totalScore[i];
                }
            }
        })
    });
}

var button = document.getElementById('addRow');
button.addEventListener(`click`, () => {
    $.ajax({
        url:'/updateScore',
        method: 'POST',
        success: function(response) {
            var allScore = response.score;
            var round = allScore[allScore.length-1];
            var newScoreBox = document.createElement('tr');
            newScoreBox.innerHTML = `<th scope='row'>${allScore.length}</th>`+
            `<td><input id="0" class="form-control" type='number' name="${allScore.length}" value="${round[0]}"/></td>`+
            `<td><input id="1" class="form-control" type='number' name="${allScore.length}" value="${round[1]}"/></td>`+
            `<td><input id="2" class="form-control" type='number' name="${allScore.length}" value="${round[2]}"/></td>`+
            `<td><input id="3" class="form-control" type='number' name="${allScore.length}" value="${round[3]}"/></td>`
            document.getElementById("body").appendChild(newScoreBox);
            
            var changeValue = document.getElementsByTagName("input");
            for (let i = 0; i < changeValue.length; i++){
                changeValue[i].addEventListener("input",() => {
                    $.ajax({
                        url:'/changeScore',
                        method: "POST",
                        contentType:"application/json",
                        data: JSON.stringify({ value: changeValue[i].value, 
                                            name: changeValue[i].name, 
                                            id: changeValue[i].id}),
                        success: (response) => {
                            var allElement = document.querySelectorAll("th#score");
                            for( let i = 0; i< response.totalScore.length; i++) {
                                allElement[i].innerHTML = response.totalScore[i];
                            }
                        }
                    })
                });
            }
        }
    })
});