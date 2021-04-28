# TODO


* Generate Puzzles or Take from Online
  * select puzzle

* Description link

* Clear board without clearing snapshots

# Generating puzzles

* generate regions of grid

  * 
  
* checking that a puzzle has a unique solution

  * translate to SAT
  
  * boolean variable for each square
  
  * boolean constraints for each game constraint
  
  * b00 b01 b02 b03 b04
  * b10 b11 b12 ...
  
  * (b00 v b01 v b02 v b03 v b04) ^ ()
  
# Representing regions

const puzzles = 
  { puzzle_1 : 
  {
  stars: 1,
  size: 5,
  borders: {
    rows: ["#|#||#", "#|#|##", "####|#", "#|#||#", "#||||#"],
    columns: ["#|#||#", "#||#|#", "##|###", "######", "#||###"],
    regions: [
      [0, 0, 1, 1, 1],
      [0, 0, 2, 2, 1],
      [3, 0, 2, 1, 1],
      [3, 3, 4, 4, 4],
      [3, 3, 3, 3, 3],
    ]
  }
}, puzzle_2 : {
  stars: 1,
  size: 5,
  borders: {
    rows: ["#|#||#","##|#|#","####|#","#|##|#","#|#||#"],
    columns: ["#|#||#","##|#|#","#|#|##","##|||#","##|||#"]
  }
}};
