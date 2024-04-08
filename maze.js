const express = require('express');
const router = express.Router();


// class for cell. It has boolean for visited(used in recursive back-track algorytm), and check edge from each side.
class MazeCell {
  constructor(isVisited, isN, isE, isS, isW) {
    this.isVisited = isVisited;
    this.isN = isN;
    this.isE = isE;
    this.isS = isS;
    this.isW = isW;
  }
}

//class for maze. It has cells matrix, solution, and path to each "stop", 
//one of them will be a tresure solution with tresure at xy of lat element.
class Maze {
  constructor(width, height) {
    let cells = [];
    for (let i = 0; i < height; i++) {
      cells.push([]);
      for (let j = 0; j < width; j++) {
        cells[i].push(new MazeCell(false, false, false, false, false));
      }
    }
    this.cells = cells;
    this.solution = [];
    this.pathToStop = [];
  }

  isStop(x, y) {
    if (x!= 0) {
      if (!this.cells[x - 1][y].isVisited) {
        return false;
      }
    }
    if (x!= this.cells.length - 1) {
      if (!this.cells[x + 1][y].isVisited) {
        return false;
      }
    }
    if (y!= 0) {
      if (!this.cells[x][y - 1].isVisited) {
        return false;
      }
    }
    if (y!= this.cells[0].length - 1) {
      if (!this.cells[x][y + 1].isVisited) {
        return false;
      }
    }
    return true;
  }

  //get all potential directions of move for cell with xy
  getAllPossibleDirections(x, y) {
    let dirs = { 'N': false, 'S': false, 'E': false, 'W': false };
    if (x!= 0) {
      if (!this.cells[x - 1][y].isVisited) {
        dirs.N = true;
      }
    }
    if (x!= this.cells.length - 1) {
      if (!this.cells[x + 1][y].isVisited) {
        dirs.S = true;
      }
    }
    if (y!= 0) {
      if (!this.cells[x][y - 1].isVisited) {
        dirs.W = true;
      }
    }
    if (y!= this.cells[0].length - 1) {
      if (!this.cells[x][y + 1].isVisited) {
        dirs.E = true;
      }
    }
    return dirs;
  }
}

//get random direction for move from object with boolean for eacch direction
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

//generate maze
function generate_maze(width, height) {
  let solution = [];
  let maze = new Maze(width, height);
  let current_path = [[0, 0]];
  maze.cells[0][0].isVisited = true;

  //we  choose first cell, then move to next random cell which isn`t already visited, and add it`s xy to stack.
  //while we can move, we move.
  //when we can`t move, we remove last element from stack and try move from it, while we can`t move again.
  //when stack becomes empty, we visited all cells and have a graph for all roads in maze.

  while (current_path.length!= 0) {
    let current = current_path[current_path.length - 1];

    if (current[0] == maze.cells.length - 1 && current[1] == maze.cells[0].length - 1) {
      solution = current_path.slice();
      maze.solution = solution;
    }

    if (maze.isStop(current[0], current[1])) {
      maze.pathToStop.push(current_path.slice());
      current_path.pop();
    } else {
      let dirs = maze.getAllPossibleDirections(current[0], current[1]);
      let dir = getRandomValidDirection(dirs);
      switch (dir) {
        case 'N':
          maze.cells[current[0]][current[1]].isN = true;
          maze.cells[current[0] - 1][current[1]].isS = true;
          maze.cells[current[0] - 1][current[1]].isVisited = true;
          current_path.push([current[0] - 1, current[1]]);
          break;
        case 'S':
          maze.cells[current[0]][current[1]].isS = true;
          maze.cells[current[0] + 1][current[1]].isN = true;
          maze.cells[current[0] + 1][current[1]].isVisited = true;
          current_path.push([current[0] + 1, current[1]]);
          break;
        case 'W':
          maze.cells[current[0]][current[1]].isW = true;
          maze.cells[current[0]][current[1] - 1].isE = true;
          maze.cells[current[0]][current[1] - 1].isVisited = true;
          current_path.push([current[0], current[1] - 1]);
          break;
        case 'E':
          maze.cells[current[0]][current[1]].isE = true;
          maze.cells[current[0]][current[1] + 1].isW = true;
          maze.cells[current[0]][current[1] + 1].isVisited = true;
          current_path.push([current[0], current[1] + 1]);
          break;
        default:
          break;
      }
    }
  }

  return maze;
}


//get rendered maze. Return is table with values for color it must be on render
function get_render_maze(maze, isTreasure, isTraps) {

  const treasureIndex = Math.floor(Math.random() * maze.pathToStop.length);
  const trapCount = Math.floor(Math.random() * 3) + 3;

  //set all cells 1(wall)
  let table = [];
  for (let i = 0; i < maze.cells.length * 2 + 1; i += 1) {
    table.push([]);
    for (let j = 0; j < maze.cells[0].length * 2 + 1; j += 1) {
      table[i].push(1);
    }
  }

  
  if (isTreasure) {

    //we check cell is it solution or treasure solution and paint all connected neightbours if it is true
    for (let j = 1; j < maze.cells[0].length * 2 + 1; j += 2) {
      for (let i = 1; i < maze.cells.length * 2 + 1; i += 2) {
        let isSolution = false;
        let isTreasureSolution = false;

        table[i][j] = 0;
        if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2)) {
          table[i][j] = 2;
          isSolution = true;
        }
        if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2, (i - i % 2) / 2)) {
          table[i][j] += 3;
          isTreasureSolution = true;
        }

        if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isN) {
          table[i - 1][j] = 0;
          if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2 - 1) && isSolution) {
            table[i - 1][j] = 2;
          }
          if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2, (i - i % 2) / 2 - 1) && isTreasureSolution) {
            table[i - 1][j] += 3;
          }
        }
        if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isS) {
          table[i + 1][j] = 0;
          if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2 + 1) && isSolution) {
            table[i + 1][j] = 2;
          }
          if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2, (i - i % 2) / 2 + 1) && isTreasureSolution) {
            table[i + 1][j] += 3;
          }
        }
        if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isE) {
          table[i][j + 1] = 0;
          if (isInSolution(maze, (j - j % 2) / 2 + 1, (i - i % 2) / 2) && isSolution) {
            table[i][j + 1] = 2;
          }
          if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2 + 1, (i - i % 2) / 2) && isTreasureSolution) {
            table[i][j + 1] += 3;
          }
        }
        if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isW) {
          table[i][j - 1] = 0;
          if (isInSolution(maze, (j - j % 2) / 2 - 1, (i - i % 2) / 2) && isSolution) {
            table[i][j - 1] = 2;
          }
          if (isInTreasureSolution(maze, treasureIndex, (j - j % 2) / 2 - 1, (i - i % 2) / 2) && isTreasureSolution) {
            table[i][j - 1] += 3;
          }
        }

        if (maze.pathToStop[treasureIndex][maze.pathToStop[treasureIndex].length - 1][1] == (j - j % 2) / 2 &&
          maze.pathToStop[treasureIndex][maze.pathToStop[treasureIndex].length - 1][0] == (i - i % 2) / 2) {
          table[i][j] = 4;
        }
      }
    }
    if (isTraps) {

        //add traps if needed
      let trapsLocationsAndCount = [];
      do {
        trapsLocationsAndCount = generateTrapsWithTreasure(trapCount, maze, treasureIndex);
      } while (trapsLocationsAndCount[1] >= 3);

      for (let i = 0; i < trapsLocationsAndCount[0].length; i++) {
        table[trapsLocationsAndCount[0][i][1] * 2 + 1][trapsLocationsAndCount[0][i][0] * 2 + 1] = 6;
      }
    }
  } else {
    //we check cell is it solution and paint all connected neightbours if it is true
    for (let j = 1; j < maze.cells[0].length * 2 + 1; j += 2) {
      for (let i = 1; i < maze.cells.length * 2 + 1; i += 2) {
        let isSolution = false;

        table[i][j] = 0;
        if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2)) {
          table[i][j] = 2;
          isSolution = true;
        }

        if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isN) {
          table[i - 1][j] = 0;
          if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2 - 1) && isSolution) {
            table[i - 1][j] = 2;
          }
        }
        if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isS) {
          table[i + 1][j] = 0;
          if (isInSolution(maze, (j - j % 2) / 2, (i - i % 2) / 2 + 1) && isSolution) {
            table[i + 1][j] = 2;
          }
        }
        if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isE) {
          table[i][j + 1] = 0;
          if (isInSolution(maze, (j - j % 2) / 2 + 1, (i - i % 2) / 2) && isSolution) {
            table[i][j + 1] = 2;
          }
        }
        if (maze.cells[(i - i % 2) / 2][(j - j % 2) / 2].isW) {
          table[i][j - 1] = 0;
          if (isInSolution(maze, (j - j % 2) / 2 - 1, (i - i % 2) / 2) && isSolution) {
            table[i][j - 1] = 2;
          }
        }
      }
    }
    if (isTraps) {
      //add traps if needed
      let trapsLocationsAndCount = [];
      do {
        trapsLocationsAndCount = generateTraps(trapCount, maze);
      } while (trapsLocationsAndCount[1] >= 3);

      for (let i = 0; i < trapsLocationsAndCount[0].length; i++) {
        table[trapsLocationsAndCount[0][i][1] * 2 + 1][trapsLocationsAndCount[0][i][0] * 2 + 1] = 6;
      }
    }
  }

  return table;
}


//check if cell with x and y on solution; return is boolean
function isInSolution(maze, x, y) {
    for (let i = 0; i < maze.solution.length; i++) {
        if (x == maze.solution[i][1] && y == maze.solution[i][0]) return true
    }
    return false
}

//check if cell with x and y on treasure solution; return is boolean
function isInTreasureSolution(maze, index, x, y) {
    for (let i = 0; i < maze.pathToStop[index].length; i++) {
        if (x == maze.pathToStop[index][i][1] && y == maze.pathToStop[index][i][0]) return true
    }
    return false
}

//generate random trap location; return is pair of x y
function generateRandomTrap(width, heigth){
    let trapXY = []
    let trapX = Math.floor(Math.random()*width)
    let trapY = Math.floor(Math.random()*heigth)
    trapXY.push(trapX)
    trapXY.push(trapY)
    return trapXY
}
//generate certain amiunt of traps with treasure; return is array of trap locations and amount of them on soolution path
function generateTrapsWithTreasure(trapCount, maze, treasureIndex){
    let trapOnPathCount = 0
    let trapsLocations = []
    for (let i =0;i<trapCount;i++){
        let trapXY = []
        let isTrapOnTreasure = false

        //trap can`t be on the same place with treasure
        do {
            trapXY  = generateRandomTrap(maze.cells[0].length, maze.cells.length)
            if (maze.pathToStop[treasureIndex][maze.pathToStop[treasureIndex].length-1][0]==trapXY[0] 
                && maze.pathToStop[treasureIndex][maze.pathToStop[treasureIndex].length-1][0]==trapXY[0]){
                    isTrapOnTreasure = true
                }
        }
       
        while(isTrapOnTreasure = false)
        
        //add new trap
        trapsLocations.push(trapXY)

        //check is it on solution or treasure solution
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

//generate certain amiunt of traps without treasure; return is array of trap locations and amount of them on soolution path
function generateTraps(trapCount, maze){
    let trapOnPathCount = 0
    let trapsLocations = []

    //generate new trap and check is it on solution
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

router.post('/maze', (req, res) => {
  const { width, height, isTreasure, isTraps } = req.body;

  if (!width || !height) {
    return res.status(400).json({ error: 'Width and height are required' });
  }

  try {
    const maze = generate_maze(width, height);
    const renderMaze = get_render_maze(maze, isTreasure, isTraps);
    res.json(renderMaze);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate maze' });
  }
});

module.exports = router;