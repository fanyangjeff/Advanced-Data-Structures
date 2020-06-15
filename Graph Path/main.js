let dragTarget = undefined;

window.onload = () =>{
    
    var table = createTable(20, 40);
    document.body.appendChild(table);

    adjustTablePosition();
    setStartPoint(1, 1);
    setEndPoint(17, 28);

    assignDraggablesForCells();
    assignDraggblesForStartPoint();
    assignDraggblesForEndPoint();

    let startButton = document.createElement("button");
    startButton.width = "30px";
    startButton.height = "20px";
    startButton.style.display = "block";
    startButton.innerHTML = "Show Path";
    document.body.appendChild(startButton);

    startButton.onclick = function(){
        findShortestPath();
    }

    let activateBlockButton = document.createElement("button");
    activateBlockButton.width = "30px";
    activateBlockButton.height = "20px";
    activateBlockButton.style.display = "block";
    activateBlockButton.innerHTML = "Draw block";
    document.body.appendChild(activateBlockButton);

    activateBlockButton.onclick = function(){
        var rows = document.querySelectorAll("tr");
        rows.forEach((tr, i) =>{
            var nodes = document.querySelectorAll("td");
            nodes.forEach((node) =>{
                node.draggable = true;
            })
        })
    }

    let clearButton = document.createElement("button");
    document.body.appendChild(clearButton);
    clearButton.width = "30px";
    clearButton.height = "20px";
    clearButton.style.display = "block";
    clearButton.innerHTML = "clear";
    clearButton.onclick = function(){
        var rows = document.querySelectorAll("tr");
        rows.forEach((tr, i) =>{
            var nodes = document.querySelectorAll("td");
            nodes.forEach((node) =>{
                if(node.classList.contains("obstacle")){
                    node.classList.remove("obstacle");
                }
                if(node.classList.contains("bfs")){
                    node.classList.remove("bfs");
                }
                if(node.classList.contains("path")){
                    node.classList.remove("path");
                }

            })
        })
    }

}

function assignDraggablesForCells(){
    var rows = document.querySelectorAll("tr");
    rows.forEach((tr, i) =>{
        var nodes = document.querySelectorAll("td");

        nodes.forEach((node, j) =>{

            drag = new DragCell(node);

            node.addEventListener("dragstart", function(event){
                let startPoint = document.querySelector(".startPoint");
                let startPointId = startPoint.id.split('-')[1] + "-" + startPoint.id.split('-')[2]

                let endPoint = document.querySelector(".endPoint");
                let endPointId = endPoint.id.split('-')[1] + "-" + endPoint.id.split('-')[2];

                if(node.id != startPointId && node.id != endPointId){
                    drag.dragStart(event, this);
                }
            })
            
            node.addEventListener("dragover", function(event){
                drag.dragOver(event, this);
            })
            
            node.addEventListener("drop", function(event, node){
                drag.dragDrop(event, this);
            })
            
            node.addEventListener("dragend", function(event){
                drag.dragEnd(event, this);
            })
            
        })
    })
}

function DragCell(node){
    this.node = node;
}

DragCell.prototype.dragStart = function(event, node){
    dragTarget = node;
}

DragCell.prototype.dragEnd = function(event, node){
    dragTarget = undefined;
}

DragCell.prototype.dragOver = function(event, node){

    if(dragTarget.classList.contains("startPoint")
    || dragTarget.classList.contains("endPoint")){
        event.preventDefault();
    }

    //the current dragging target is a cell, we are trying to draw some obstables
    else{
        node.classList.add("obstacle");
    }
}

DragCell.prototype.dragDrop = function(event, node){
    var pointClassName = event.dataTransfer.getData("Text");
    var pointElement = document.querySelector("." + pointClassName);

    if(dragTarget.classList.contains("startPoint")){
        let endPointId = document.querySelector(".endPoint").id.split('-').slice(1, 3);
        let curNodeId = node.id.split('-');
    
        if(endPointId[0] == curNodeId[0] && endPointId[1] == curNodeId[1]){
            //console.log("overlap");
            return;
        }
            
    }

    if(dragTarget.classList.contains("endPoint")){
        let startPointId = document.querySelector(".startPoint").id.split('-').slice(1, 3);
        let curNodeId = node.id.split('-');

        if(startPointId[0] == curNodeId[0] && startPointId[1] == curNodeId[1]){
            //console.log("overlap");
            return;
        }
           
    }

    //check if start point and end point overlap, 
    //if they do, do not append to the cell.
    pointElement.id = "div-" + node.id;
    node.appendChild(pointElement);
}



function assignDraggblesForStartPoint(){
    var startPoint = document.querySelector("." + "startPoint");
    var drag = new DragPoint(startPoint);
    startPoint.addEventListener("dragstart", function(event){
        drag.dragStart(event, this);
    })

    startPoint.addEventListener('dragend', function(event){
        drag.dragEnd(event, this);
    })
    
}

function assignDraggblesForEndPoint(){
    var endPoint = document.querySelector(".endPoint");
    var drag =  new DragPoint(endPoint);
    endPoint.addEventListener("dragstart", function(event){
        drag.dragStart(event, this);
    })

    endPoint.addEventListener("dragend", function(event){
        drag.dragEnd(event, this);
    })
}



function DragPoint(node){
    this.node = node;
}

DragPoint.prototype.dragStart = function(event, node){
    event.dataTransfer.setData("Text", node.classList[0]);
    dragTarget = node;
}

DragPoint.prototype.dragEnd = function(event, node){
    dragTarget = undefined;
}


function createTable(r, column){
    var table = document.createElement("table");
    for(var i = 0; i < r; i++){
        var row = document.createElement("tr");
        for(var j = 0; j < column; j++){
            var cell = document.createElement("td");
            cell.id = i + "-" + j;
            cell.style.width = "20px";
            cell.style.height = "20px";
            cell.classList.add("cell");
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table
}

function adjustTablePosition(){
    let table = document.querySelector("table");
    table.style.left = (document.body.offsetWidth - table.offsetWidth) / 2;
    table.style.top =  (document.body.offsetHeight - table.offsetHeight) / 2;
}


function setStartPoint(i, j){
    let id = i.toString() + "-" + j.toString();
    var initialCell = document.getElementById(id);
    var startDiv = document.createElement("div");
    initialCell.appendChild(startDiv);
    startDiv.classList.add("startPoint");
    startDiv.style.width = initialCell.offsetWidth;
    startDiv.style.height = initialCell.offsetHeight;
    startDiv.id = "div-" + id;
    startDiv.draggable = true;
}

function setEndPoint(i, j){
    let id = i.toString() + "-" + j.toString();
    var endCell = document.getElementById(id);
    var endDiv = document.createElement("div");
    endCell.appendChild(endDiv);
    endDiv.classList.add("endPoint");
    endDiv.style.width = endCell.offsetWidth;
    endDiv.style.height = endCell.offsetHeight;
    endDiv.draggable = true;
    endDiv.id = "div-" + id;
    endDiv.draggable = true;
}


function findShortestPath(){
    var startPoint = document.querySelector(".startPoint");
    var endPoint = document.querySelector(".endPoint");
    bfs(startPoint, endPoint);
}


function bfs(startPoint, endPoint){
    let height = document.querySelectorAll("tr").length;
    let width = document.querySelector("tr").querySelectorAll("td").length;
    let orientation = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    
    var queue = [];
    var found = false;
    let sp = startPoint.id.split('-').slice(1, 3);
    let ep = endPoint.id.split('-').slice(1, 3);
    var visited = new Map();
    var path = new Map();
    queue.push(sp);
    visited.set(startPoint.id, true);

    
    //using promise instead of direct callback
    new Promise((resolve, reject) =>{
        var interval = setInterval(() => {
            if(queue.length == 0){
                found = false;
                clearInterval(interval);
                reject();
            }else{
                var cur = queue.shift();
                if(cur[0] == ep[0] && cur[1] == ep[1]){
                    found = true;
                    clearInterval(interval);
                    //printPath(path, sp[0] + "-" + sp[1], ep[0] + "-" + ep[1]);
                    resolve(path);
        
                }else{
                    let id = cur[0] + "-" + cur[1];
                    var curCell = document.getElementById(id);
                    if(cur[0] != sp[0] || cur[1] != sp[1])
                        curCell.classList.add("bfs");
                    
                    //add its neightbors
                    for(var k = 0; k < 4; k++){
                        i = parseInt(cur[0]) + orientation[k][0];
                        j = parseInt(cur[1]) + orientation[k][1];
                        
                        if(i >= 0 && i < height && j >= 0 && j < width && 
                            !visited.has(i + "-" + j)){

                                var cellId = i + "-" + j;
                                var cell = document.getElementById(cellId);

                                if(cell.classList.contains("obstacle"))
                                    continue;
                                
                                visited.set(i + "-" + j, true);
                                path.set(i + "-" + j, cur[0] + "-" + cur[1]);
                                queue.push([i.toString(), j.toString()]);
                            
                        }
                    }
                }
        }
            
        }, 1);
    }).then((path) =>{
        printPath(path, sp[0] + "-" + sp[1], ep[0] + "-" + ep[1]);
    }).catch(() =>{
        alert("path not found");
    })
}

function printPath(path, startPoint, endPoint){
    if(startPoint == endPoint){
        return;
    }

    var cur = endPoint;
    var interval = setInterval(() => {
        if(!path.has(cur) || cur == startPoint){
            clearInterval(interval);
        }else{
            if(cur != endPoint){
                document.getElementById(cur).classList.remove('bfs');
                document.getElementById(cur).classList.add("path");
            }
                cur = path.get(cur);
        }
    }, 10);
}
