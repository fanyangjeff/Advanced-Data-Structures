
var availableCells = [];

//key: id, value: node
var nodesMap = new Map();

//key: edge, value: a pair of nodes [nodeA, nodeB]
var edges = new Map();

//
var edgeIndex = 0;
window.onload = () =>{
    //create a table 
    setUpMainContainer();
    createTable(12, 28);

    addNodeHelper("A",2, 15);
    addNodeHelper("B", 4, 10);
    addNodeHelper("C", 2, 18);

    addNodeHelper("D", 8, 11);
    addNodeHelper("E", 8, 17);
    addNodeHelper("F", 5, 19);
    

    addEdge(15, "A", "B");
    addEdge(10, "A", "C");
    addEdge(12, "A", "E");
    addEdge(18, "B", "D");
    addEdge(33, "D", "E");
    addEdge(19, "E", "F");
    addEdge(20, "C", "F");
    addEdge(22, "B", "E");
    addEdge(23, "A", "F");


}

function setUpMainContainer(){
    let body = document.body;
    let container = document.createElement("div");
    container.id = "container";
    container.style.width = "1400px";
    container.style.height = "600px";
    body.appendChild(container);
    container.style.left = (body.offsetWidth - container.offsetWidth) / 2;
    container.style.top = (body.offsetHeight - container.offsetHeight) / 2;
}


function createTable(r, column){
    var mainContainer = document.querySelector("#container");
    var table = document.createElement("table");
    for(var i = 0; i < r; i++){
        var row = document.createElement("tr");
        for(var j = 0; j < column; j++){
            var cell = document.createElement("td");
            cell.id = i + "-" + j;
            cell.style.width = "50px";
            cell.style.height = "50px";
            cell.classList.add("cell");
            row.appendChild(cell);
            availableCells.push(cell);
        }
        table.appendChild(row);
    }
    mainContainer.appendChild(table);
}

function addNodeHelper(value, i, j){
    if(nodesMap.has(value)){
        alert("node existed")
        return;
    }
    let container = document.querySelector("#container");
    let node = document.createElement("div");
    node.classList.add("node");
    node.innerHTML = value;
    var availableCell = document.getElementById(i + "-" + j);

    container.appendChild(node);
    node.style.left = availableCell.offsetLeft;
    node.style.top = availableCell.offsetTop;
    //intialize an empty array for neighbors 
    node.neighbors = new Array();
    node.edges = new Map();
    nodesMap.set(value, node);
    node.value = value;

    new MouseDrag(node);
}
function addNode(value){
    if(nodesMap.has(value)){
        alert("node existed")
        return;
    }
    let container = document.querySelector("#container");
    let node = document.createElement("div");
    node.classList.add("node");
    node.innerHTML = value;
    var availableCell = availableCells.shift();

    container.appendChild(node);
    node.style.left = availableCell.offsetLeft;
    node.style.top = availableCell.offsetTop;
    //intialize an empty array for neighbors 
    node.neighbors = new Array();
    node.edges = new Map();
    nodesMap.set(value, node);
    node.value = value;

    new MouseDrag(node);
}

function addEdge(weight, nodeA_value, nodeB_value){
    if(!nodesMap.has(nodeA_value) || !nodesMap.has(nodeB_value)){
        alert("node does not exist, please add node first");
        return;
    }
    var nodeA = nodesMap.get(nodeA_value);
    var nodeB = nodesMap.get(nodeB_value);

    //add to each other's neighbors 

    nodeA.neighbors.push(nodeB);
    nodeB.neighbors.push(nodeA);
    //add edge to both of the nodes, two nodes share the same edge

    var edgeId = "edge" + edgeIndex.toString();

    //add edges to nodes  
    nodeA.edges.set(nodeB, edgeId);
    nodeB.edges.set(nodeA, edgeId);
    edgeIndex++;

    drawEdge(weight, edgeId, nodeA, nodeB);
}


function drawEdge(weight, edgeId, nodeA, nodeB){
    var container = document.getElementById("container");
    var center1_x = nodeA.offsetWidth/2 + nodeA.offsetLeft;
    var center1_y = nodeA.offsetHeight/2 + nodeA.offsetTop;
    var center2_x = nodeB.offsetWidth/2 + nodeB.offsetLeft;
    var center2_y = nodeB.offsetHeight/2 + nodeB.offsetTop;

    var edge = document.createElement("div");
    var textNode = document.createElement("div");
    textNode.innerHTML = weight;
    textNode.classList.add("textNode");
    edge.appendChild(textNode);

    edge.id = edgeId;
    edge.weight = weight;
    edge.classList.add("edge");
    edge.style.height = distance(center1_x, center2_x, center1_y, center2_y) + "px";
    container.appendChild(edge);
    edge.style.left = center1_x;
    edge.style.top = center1_y;
    edge.style.transformOrigin = "0 0";
    var degree = computeDegree(center1_x, center2_x, center1_y, center2_y);
    edge.style.transform = "rotate(" + degree.toString() + "deg)";


    textNode.style.top = edge.offsetHeight / 2;
    textNode.style.transformOrigin = "0 0";

    if(center1_x >= center2_x){
        textNode.style.transform = "rotate(-90deg)";
    }else{
        textNode.style.transform = "rotate(90deg)";
    }

}


function clearEdge(edgeId){
    var edge = document.getElementById(edgeId);
    var mainDiv = document.querySelector("#container");
    mainDiv.removeChild(edge);
}


function computeDegree(x1, x2, y1, y2){
    var slope = (x2 - x1) / (y1 - y2);
    var angle = Math.atan(slope);
    var degree = angle / (2 * Math.PI) * 360;

    if ((x2 < x1 && y2 <= y1) || (x1 <= x2 && y1 >= y2))
        return degree - 180;
    return degree;
}

function distance(x1, x2, y1, y2){
    return Math.sqrt(Math.abs(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));
}


function MouseDrag(node){
    this.node = node;
    let _this = this;
    this.mainDiv = document.querySelector("#container");
    this.upperBound = this.mainDiv.offsetTop;
    this.lowerBound = this.mainDiv.offsetHeight;
    this.leftBound = this.mainDiv.offsetLeft;
    this.rightBound = this.mainDiv.offsetWidth;

    this.node.onmousedown = function(ev){
        _this.mouseDown(ev);
    }

    this.node.onmouseup = function(){
        _this.mouseUp();
    }

    this.node.onmouseleave = function(){
        _this.mouseLeave();
    }
}

MouseDrag.prototype.mouseDown = function(event){
    var ev = event || window.event;
    this.offsetX = ev.clientX - this.node.offsetLeft;
    this.offsetY = ev.clientY - this.node.offsetTop;
    let _this = this;
    this.node.onmousemove = function(ev){
        _this.mouseMove(ev);
    }
}

MouseDrag.prototype.mouseMove = function(event){
    var e = event || window.event;

    if(e.clientX - this.offsetX < 0 || 
        e.clientX - this.offsetX > this.rightBound - e.target.offsetWidth || 
        e.clientY - this.offsetY < 0 ||
        e.clientY - this.offsetY > this.lowerBound - e.target.offsetHeight
        )
        return;

    this.node.style.left = e.clientX - this.offsetX + "px";
    this.node.style.top = e.clientY - this.offsetY + "px";

    this.node.neighbors.forEach(neighbor =>{
        let edgeId = this.node.edges.get(neighbor)
        let edge = document.getElementById(edgeId);
        clearEdge(edgeId);
        drawEdge(edge.weight, edgeId, this.node, neighbor);
    })

    
}

MouseDrag.prototype.mouseLeave = function(){
    this.node.onmousemove = null;
}   

MouseDrag.prototype.mouseUp = function(){
    this.node.onmousemove = null;
}
