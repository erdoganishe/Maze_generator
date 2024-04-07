
//class, go to back
class MazeCell {
    constructor(isVisited, isN, isE, isS, isW) {
        this.isVisited = isVisited
        this.isN = isN
        this.isE = isE
        this.isS = isS
        this.isW = isW
    }

}
//class, go to back
class Maze {
    constructor(width, height) {
        let cells = []
        for (let i = 0; i < height; i++) {
            cells.push([])
            for (let j = 0; j < width; j++) {
                cells[i].push(new MazeCell(false, false, false, false, false))
            }
        }
        this.cells = cells
        this.solution = []
        this.pathToStop = []

    }

    isStop(x, y) {
        if (x != 0) {
            if (!this.cells[x - 1][y].isVisited) {
                return false
            }
        }
        if (x != this.cells.length - 1) {
            if (!this.cells[x + 1][y].isVisited) {
                return false
            }
        }
        if (y != 0) {
            if (!this.cells[x][y - 1].isVisited) {
                return false
            }
        }
        if (y != this.cells[0].length - 1) {
            if (!this.cells[x][y + 1].isVisited) {
                return false
            }
        }
        return true
    }

    getAllPossibleDirections(x, y) {
        let dirs = { 'N': false, 'S': false, 'E': false, 'W': false }
        if (x != 0) {
            if (!this.cells[x - 1][y].isVisited) {
                dirs.N = true
            }
        }
        if (x != this.cells.length - 1) {
            if (!this.cells[x + 1][y].isVisited) {
                dirs.S = true
            }
        }
        if (y != 0) {
            if (!this.cells[x][y - 1].isVisited) {
                dirs.W = true
            }
        }
        if (y != this.cells[0].length - 1) {
            if (!this.cells[x][y + 1].isVisited) {
                dirs.E = true
            }
        }
        return dirs
    }


}

//func for maze, back
function getRandomValidDirection(directions) {
    const validDirections = [];
    if (directions.N) {
        validDirections.push('N');
    }

    if (directions.S) {
        validDirections.push('S');
    }

    if (directions.W) {
        validDirections.push('W');
    }

    if (directions.E) {
        validDirections.push('E');
    }

    const randomIndex = Math.floor(Math.random() * validDirections.length);

    return validDirections[randomIndex];

}

//maze generation, to back
function generate_maze(width, height) {
    let solution = []
    let maze = new Maze(width, height)
    let current_path = [[0, 0]]
    maze.cells[0][0].isVisited = true


    while (current_path.length != 0) {

        let current = current_path[current_path.length - 1]

        if (current[0] == maze.cells.length - 1 && current[1] == maze.cells[0].length - 1) {
            solution = current_path.slice()
            maze.solution = solution;
        }

        if (maze.isStop(current[0], current[1])) {
            maze.pathToStop.push(current_path.slice())
            current_path.pop()
        }
        else {
            let dirs = maze.getAllPossibleDirections(current[0], current[1])
            let dir = getRandomValidDirection(dirs)
            switch (dir) {
                case 'N':
                    maze.cells[current[0]][current[1]].isN = true
                    maze.cells[current[0] - 1][current[1]].isS = true
                    maze.cells[current[0] - 1][current[1]].isVisited = true
                    current_path.push([current[0] - 1, current[1]])
                    break;
                case 'S':
                    maze.cells[current[0]][current[1]].isS = true
                    maze.cells[current[0] + 1][current[1]].isN = true
                    maze.cells[current[0] + 1][current[1]].isVisited = true
                    current_path.push([current[0] + 1, current[1]])
                    break;
                case 'W':
                    maze.cells[current[0]][current[1]].isW = true
                    maze.cells[current[0]][current[1] - 1].isE = true
                    maze.cells[current[0]][current[1] - 1].isVisited = true
                    current_path.push([current[0], current[1] - 1])
                    break;
                case 'E':
                    maze.cells[current[0]][current[1]].isE = true
                    maze.cells[current[0]][current[1] + 1].isW = true
                    maze.cells[current[0]][current[1] + 1].isVisited = true
                    current_path.push([current[0], current[1] + 1])
                    break;
                default:
                    break
            }


        }
    }

    return maze

}

//to back, result sends to front
function get_render_maze(maze, isTreasure, isTraps) {
    const treasureIndex = Math.floor(Math.random() * maze.pathToStop.length);
    const trapCount = Math.floor(Math.random() * 3) + 3;

    let table = []
    for (let i = 0; i < maze.cells.length * 2 + 1; i += 1) {
        table.push([])
        for (let j = 0; j < maze.cells[0].length * 2 + 1; j += 1) {
            table[i].push(1)
        }
    }
    if (isTreasure) {
        for (let j = 1; j < maze.cells[0].length * 2 + 1; j += 2) {
            for (let i = 1; i < maze.cells.length * 2 + 1; i += 2) {


                let isSolution = false
                let isTreasureSolution = false

                table[i][j] = 0
                if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2)) {
                    table[i][j] = 2
                    isSolution = true
                }
                if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2, (i - i % 2) / 2)) {
                    table[i][j] += 3
                    isTreasureSolution = true
                }

                if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isN) {
                    table[i - 1][j] = 0
                    if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2 - 1) && isSolution) {
                        table[i - 1][j] = 2
                    }
                    if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2, (i - i % 2) / 2 - 1) && isTreasureSolution) {
                        table[i - 1][j] += 3
                    }
                }
                if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isS) {
                    table[i + 1][j] = 0
                    if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2 + 1) && isSolution) {
                        table[i + 1][j] = 2
                    }
                    if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2, (i - i % 2) / 2 + 1) && isTreasureSolution) {
                        table[i + 1][j] += 3
                    }
                }
                if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isE) {
                    table[i][j + 1] = 0
                    if (isInSolution(maze, (j - j % 2) / 2 + 1, (i - i % 2) / 2) && isSolution) {
                        table[i][j + 1] = 2
                    }
                    if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2 + 1, (i - i % 2) / 2) && isTreasureSolution) {
                        table[i][j + 1] += 3
                    }
                }
                if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isW) {
                    table[i][j - 1] = 0
                    if (isInSolution(maze, (j - j % 2) / 2 - 1, (i - i % 2) / 2) && isSolution) {
                        table[i][j - 1] = 2
                    }
                    if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2 - 1, (i - i % 2) / 2) && isTreasureSolution) {
                        table[i][j - 1] += 3
                    }
                }

                if (maze.pathToStop[treasureIndex][maze.pathToStop[treasureIndex].length - 1][1] == (j - j % 2) / 2 &&
                    maze.pathToStop[treasureIndex][maze.pathToStop[treasureIndex].length - 1][0] == (i - i % 2) / 2) {
                    table[i][j] = 4
                }

            }
        }
        if (isTraps){
            let trapsLocationsAndCount = []
            do 
            {trapsLocationsAndCount = generateTrapsWithTreasure(trapCount, maze, treasureIndex)}
            while (trapsLocationsAndCount[1]>=3)
    
            for (let i=0;i<trapsLocationsAndCount[0].length;i++){
                table[trapsLocationsAndCount[0][i][0]*2+1][trapsLocationsAndCount[0][i][1]*2+1] = 6
                console.log("Trap here added")
                console.log("Traps on path", trapsLocationsAndCount)
            }

        }
        
        

    }
    else {

        for (let j = 1; j < maze.cells[0].length * 2 + 1; j += 2) {
            for (let i = 1; i < maze.cells.length * 2 + 1; i += 2) {

                let isSolution = false

                table[i][j] = 0
                if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2)) {
                    table[i][j] = 2
                    isSolution = true
                }

                if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isN) {
                    table[i - 1][j] = 0
                    if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2 - 1) && isSolution) {
                        table[i - 1][j] = 2
                    }
                }
                if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isS) {
                    table[i + 1][j] = 0
                    if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2 + 1) && isSolution) {
                        table[i + 1][j] = 2
                    }
                }
                if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isE) {
                    table[i][j + 1] = 0
                    if (isInSolution(maze, (j - j % 2) / 2 + 1, (i - i % 2) / 2) && isSolution) {
                        table[i][j + 1] = 2
                    }
                }
                if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isW) {
                    table[i][j - 1] = 0
                    if (isInSolution(maze, (j - j % 2) / 2 - 1, (i - i % 2) / 2) && isSolution) {
                        table[i][j - 1] = 2
                    }
                }

            }
        }
        if(isTraps){
            let trapsLocationsAndCount = []
            do 
                {trapsLocationsAndCount = generateTraps(trapCount, maze)}
            while (trapsLocationsAndCount[1]>=3)
    
            for (let i=0;i<trapsLocationsAndCount[0].length;i++){
                table[trapsLocationsAndCount[0][i][0]*2+1][trapsLocationsAndCount[0][i][1]*2+1] = 6
                console.log("Trap here added 2")
                console.log("Traps on path 2", trapsLocationsAndCount)
            }
        }
    }

    return table
}

//to back
function isInSolution(maze, x, y) {
    for (let i = 0; i < maze.solution.length; i++) {
        if (x == maze.solution[i][1] && y == maze.solution[i][0]) return true
    }
    return false
}
//to back
function isInTreasureSolution(maze, index, x, y) {
    for (let i = 0; i < maze.pathToStop[index].length; i++) {
        if (x == maze.pathToStop[index][i][1] && y == maze.pathToStop[index][i][0]) return true
    }
    return false
}
//to back
function generateRandomTrap(width, heigth){
    let trapXY = []
    let trapX = Math.floor(Math.random()*width)
    let trapY = Math.floor(Math.random()*heigth)
    trapXY.push(trapX)
    trapXY.push(trapY)
    return trapXY
}
//to back
function generateTrapsWithTreasure(trapCount, maze, treasureIndex){
    let trapOnPathCount = 0
    let trapsLocations = []
    for (let i =0;i<trapCount;i++){
        let trapXY = []
        let isTrapOnTreasure = false
        do {
            trapXY  = generateRandomTrap(maze.cells[0].length, maze.cells.length)
            if (maze.pathToStop[treasureIndex][maze.pathToStop[treasureIndex].length-1][0]==trapXY[0] 
                && maze.pathToStop[treasureIndex][maze.pathToStop[treasureIndex].length-1][0]==trapXY[0]){
                    isTrapOnTreasure = true
                }
        }
       
        while(isTrapOnTreasure = false)
        

        trapsLocations.push(trapXY)
        console.log(trapXY)
        let isOnPath = false
        for (let j=0;j<maze.solution.length;j++){

            if (maze.solution[j][0]==trapXY[0] && maze.solution[j][1]==trapXY[1]){
                isOnPath = true
            }
        }
        for (let j=0; j<maze.pathToStop[treasureIndex].length-1;j++){
            if (maze.pathToStop[treasureIndex][j][0]==trapXY[0] && maze.pathToStop[treasureIndex][j][1]==trapXY[1]){
                isOnPath = true
            }
        }
        if(isOnPath){
            trapOnPathCount++
        }
    }
    return [trapsLocations, trapOnPathCount]
}

//to back
function generateTraps(trapCount, maze){
    let trapOnPathCount = 0
    let trapsLocations = []
    for (let i =0;i<trapCount;i++){
        let trapXY = generateRandomTrap(maze.cells[0].length, maze.cells.length)
        trapsLocations.push(trapXY)
        let isOnPath = false
        for (let j=0;j<maze.solution.length;j++){

            if (maze.solution[j]==trapXY){
                isOnPath = true
            }
        }
        
        if(isOnPath){
            trapOnPathCount++
        }
    }
    return [trapsLocations, trapOnPathCount]
}
//render, front
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




//front
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

//front
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

//add post request
generate_button.addEventListener('click', () => {
    const inputs = document.getElementsByClassName("value-input")
    const options = document.getElementsByClassName("option-input")
    const width = inputs[0].value
    const height = inputs[1].value
    const isTreasure = options[0].checked
    const isTraps = options[1].checked

    let maze = generate_maze((width - 1) / 2, (height - 1) / 2)

    render = get_render_maze(maze, isTreasure, isTraps)
    render_maze(render)

    const resultDiv = document.getElementsByClassName("result")[0]
    resultDiv.classList.remove("hidden")

})
