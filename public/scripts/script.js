//render table get from back-end
function render_maze(render) {
    const table = document.getElementsByClassName("result-table")[0]

    if (render.length > render[0].length) {
        table.style.width = 500 * render.length / render[0].length + 'px'

    }
    else {
        table.style.height = 500 * render.length / render[0].length + 'px'

    }

    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i >= 0; i--) {
        table.deleteRow(i);
    }

    for (var i = 0; i < render.length; i++) {
        var row = table.insertRow()
        for (let j = 0; j < render[0].length; j++) {
            var cell = row.insertCell(j)
            if (render[i][j] == 1) {
                cell.className = "wall"
            }
            if (render[i][j] == 0) {
                cell.className = "road"
            }
            if (render[i][j] == 2) {
                cell.className = "solution"
            }
            if (render[i][j] == 3) {
                cell.className = "solution2"
            }
            if (render[i][j] == 4) {
                cell.className = "treasure"
            }
            if (render[i][j] == 5) {
                cell.className = "solution2 solution"
            }
            if (render[i][j] == 6) {
                cell.className = "trap"
            }
            if (i == render.length - 2 && j == render[0].length - 1) {
                cell.className = "exit"
            }
            if (i == 1 && j == 0) {
                cell.className = "entrance"
            }

        }

    }
    solutionCheckBox.checked = false
    RemoveVision()
}

//Hide solution
function RemoveVision() {
    const elems = document.getElementsByClassName("solution")
    const elems2 = document.getElementsByClassName("solution2")

    for (let i = 0; i < elems.length; i++) {
        elems[i].classList.add('road')
    }
    for (let i = 0; i < elems2.length; i++) {
        elems2[i].classList.add('road')
    }
}

//Show solution
function addVision() {
    const elems = document.getElementsByClassName("solution")
    const elems2 = document.getElementsByClassName("solution2")

    for (let i = 0; i < elems.length; i++) {
        elems[i].classList.remove('road')
    }
    for (let i = 0; i < elems2.length; i++) {
        elems2[i].classList.remove('road')
    }
}

//setup
const generate_button = document.getElementsByClassName("send-button")[0]
const solutionCheckBox = document.getElementsByClassName("solution-input")[0]
solutionCheckBox.checked = false

solutionCheckBox.addEventListener('change', () => {
    if (solutionCheckBox.checked) {
        addVision()
    }
    else {
        RemoveVision()
    }
})

//add event for generate button
generate_button.addEventListener('click', async () => {
    const inputs = document.getElementsByClassName("value-input")
    const options = document.getElementsByClassName("option-input")
    const width = (inputs[0].value - 1) /2
    const height = (inputs[1].value -1) /2
    const isTreasure = options[0].checked
    const isTraps = options[1].checked

    //add post request to get table to render
    const response = await fetch('/api/maze', {
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json'  
        },  
        body: JSON.stringify({ width, height, isTreasure, isTraps })  
      });
      if (!response.ok) {
        throw new Error('Failed to generate maze');  
      }  
      const render = await response.json();
    render_maze(render)

    const resultDiv = document.getElementsByClassName("result")[0]
    resultDiv.classList.remove("hidden")

})
