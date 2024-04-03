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

    let maze = new Maze(width,height)
    let current_path = [[0,0]]
    maze.cells[0][0].isVisited=true


    while (current_path.length!=0){

        let current = current_path[current_path.length-1]
        
        if (current[0] == maze.cells[0].length-1 && current[1]==maze.cells.length-1){
            maze.solution = current_path
            console.log(maze.solution)
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


let maze = generate_maze(5,5)

console.log("This is maze",maze)
console.log("This is solution", maze.solution)