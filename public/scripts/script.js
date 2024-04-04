class MazeCell{
    constructor(isVisited, isN, isE, isS, isW) {
        this.isVisited = isVisited
        this.isN = isN
        this.isE = isE
        this.isS = isS
        this.isW = isW
    }

}

class Maze{
    constructor(width, height){
        let cells = []
        for (let i = 0;i<height;i++){
            cells.push([])
            for (let j=0;j<width;j++){
                cells[i].push(new MazeCell(false,false,false,false,false))
            }
        }
        this.cells = cells
        this.solution = []

    }

    isStop(x,y){
        if (x!=0){
            if (!this.cells[x-1][y].isVisited){
                return false
            }
        }
        if (x!=this.cells.length-1){
            if (!this.cells[x+1][y].isVisited){
                return false
            }
        }
        if (y!=0){
            if (!this.cells[x][y-1].isVisited){
                return false
            }
        }
        if (y!=this.cells[0].length-1){
            if (!this.cells[x][y+1].isVisited){
                return false
            }
        }
        return true
    }

    getAllPossibleDirections(x,y){
        let dirs = {'N':false,'S':false,'E':false,'W':false}
        if (x!=0){
            if (!this.cells[x-1][y].isVisited){
                dirs.N = true
            }
        }
        if (x!=this.cells.length-1){
            if (!this.cells[x+1][y].isVisited){
                dirs.S = true
            }
        }
        if (y!=0){
            if (!this.cells[x][y-1].isVisited){
                dirs.W = true
            }
        }
        if (y!=this.cells[0].length-1){
            if (!this.cells[x][y+1].isVisited){
                dirs.E = true
            }
        }
        return dirs
    }

   
}

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

function generate_maze(width,height){
    let solution = []
    let maze = new Maze(width,height)
    let current_path = [[0,0]]
    maze.cells[0][0].isVisited=true


    while (current_path.length!=0){

        let current = current_path[current_path.length-1]
        
        if (current[0] == maze.cells.length-1 && current[1]==maze.cells[0].length-1){
            solution = current_path.slice()
            maze.solution=solution;
        }

        if(maze.isStop(current[0],current[1])){
            current_path.pop()
        }
        else{
            let dirs = maze.getAllPossibleDirections(current[0],current[1])
            let dir = getRandomValidDirection(dirs)
            switch (dir) {
                case 'N':
                    maze.cells[current[0]][current[1]].isN = true
                    maze.cells[current[0]-1][current[1]].isS = true
                    maze.cells[current[0]-1][current[1]].isVisited = true
                    current_path.push([current[0]-1, current[1]])
                break;
                case 'S':
                    maze.cells[current[0]][current[1]].isS = true
                    maze.cells[current[0]+1][current[1]].isN = true
                    maze.cells[current[0]+1][current[1]].isVisited = true
                    current_path.push([current[0]+1, current[1]])
                break;
                case 'W':
                    maze.cells[current[0]][current[1]].isW = true
                    maze.cells[current[0]][current[1]-1].isE = true
                    maze.cells[current[0]][current[1]-1].isVisited = true
                    current_path.push([current[0], current[1]-1])
                break;
                case 'E':
                    maze.cells[current[0]][current[1]].isE = true
                    maze.cells[current[0]][current[1]+1].isW = true
                    maze.cells[current[0]][current[1]+1].isVisited = true
                    current_path.push([current[0], current[1]+1])
                break;
                default:
                    break
            }
              
             
        }
    } 

    return maze

}

function get_render_maze(maze){
    console.log(maze.solution)
    let table = []
    for(let i = 0; i< maze.cells.length*2+1;i +=1){
        table.push([])
        for(let j = 0; j<maze.cells[0].length*2+1; j +=1){
            table[i].push(1)
        }
    }

    for(let j = 1; j<maze.cells[0].length*2+1;j +=2){
        for(let i = 1; i<maze.cells.length*2+1; i +=2){

            let isSolution = false

            table[i][j] = 0
            if (isInSolution(maze, (j-j%2)/2, (i-i%2)/2)){
                table[i][j] = 2 
                isSolution = true               
            }

            if (maze.cells[(i-i%2)/2][(j-j%2)/2].isN){
                table[i-1][j] = 0
                if (isInSolution(maze, (j-j%2)/2, (i-i%2)/2  - 1) && isSolution){
                    table[i-1][j] = 2              
                }
            }
            if (maze.cells[(i-i%2)/2][(j-j%2)/2].isS){
                table[i+1][j] = 0
                if (isInSolution(maze, (j-j%2)/2, (i-i%2)/2 + 1) && isSolution){
                    table[i+1][j] = 2               
                }
            }
            if (maze.cells[(i-i%2)/2][(j-j%2)/2].isE){
                table[i][j+1] = 0
                if (isInSolution(maze, (j-j%2)/2+1, (i-i%2)/2) && isSolution){
                    table[i][j+1] = 2               
                }
            }
            if (maze.cells[(i-i%2)/2][(j-j%2)/2].isW){
                table[i][j-1] = 0
                if (isInSolution(maze, (j-j%2)/2 - 1, (i-i%2)/2) && isSolution){
                    table[i][j-1] = 2               
                }
            }

        }
    }
    return table
}

function isInSolution(maze, x, y){
    for (let i = 0; i<maze.solution.length; i++){
        if (x == maze.solution[i][1] && y == maze.solution[i][0]) return true
    }
    return false
}

function render_maze(render){
    const table = document.getElementsByClassName("result-table")[0]

    if (render.length > render[0].length){
        table.style.width = 500*render.length/render[0].length + 'px'
        console.log(table.style.width, table.style.height)
    }
    else{
        table.style.height = 500*render.length/render[0].length + 'px'
        console.log(table.style.width, table.style.height)
    }

    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i >= 0; i--) {
        table.deleteRow(i);
    }

    for (var i = 0;i < render.length; i++){
        var row = table.insertRow()
        for (let j=0; j<render[0].length;j++){
            var cell = row.insertCell(j)
            if (render[i][j]==1){
                cell.className = "wall"
            }
            if (render[i][j]==0){
                cell.className = "road"
            }
            if (render[i][j]==2){
                cell.className = "solution"
            }
            // if (render[i][j]==3){
            //     cell.className = "treasure"
            // }
            if ((i==1 && j==0)||(i==render.length-2 && j==render[0].length-1)){
                cell.className = "exit"
            }
        }
        
    }
}
function changeSolutionColor(newColor) {

    var styleElement = document.querySelector('style');

    if (styleElement) {

        var cssRules = styleElement.textContent;

        cssRules = cssRules.replace(/\.solution\s*{\s*background-color:\s*[^;]+;/, '.solution { background-color: ' + newColor + ';');


        styleElement.textContent = cssRules;
    } else {

        var newStyleElement = document.createElement('style');
        newStyleElement.textContent = '.solution { background-color: ' + newColor + '; }';
        document.head.appendChild(newStyleElement);
    }
}


const generate_button = document.getElementsByClassName("send-button")[0]


generate_button.addEventListener('click', ()=>{
    const inputs = document.getElementsByClassName("value-input")
    const width = inputs[0].value
    const height = inputs[1].value
    let maze = generate_maze((width-1)/2 , (height-1)/2)
    console.log(maze)
    render = get_render_maze(maze)
    render_maze(render)

    const resultDiv = document.getElementsByClassName("result")[0]
    resultDiv.classList.remove("hidden")
    console.log("done")
})


const solutionCheckBox = document.getElementsByClassName("solution-input")[0]
solutionCheckBox.checked = false
changeSolutionColor('white')

solutionCheckBox.addEventListener('change', ()=>{
    if (solutionCheckBox.checked){
        changeSolutionColor('coral')
    }
    else{
        changeSolutionColor('white')
    }
    
})



