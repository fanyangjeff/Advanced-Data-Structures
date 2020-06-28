var availableCells = [];

//key: id, value: node
var nodesMap = new Map();

//node to start width
var startNode = undefined;

//key: edge, value: a pair of nodes [nodeA, nodeB]
var edges = new Map();

var numOfNodes = 0;

var edgeIndex = 0;

var templatePositions = [{'A': [1, 8], 'B':[2, 12], 'C':[3, 8], 'D':[5, 10], 'E':[5, 6], 'F':[2, 4]},
                        {'A':[1, 8], 'B':[4, 12], 'C':[7, 10], 'D':[7, 6], 'E': [4, 4]}]
window.onload = ()=>{

    //create a table 
 
    setUpMainContainer();
    setUpMenuContainer();
    setUpTableContainer();
    createTable(12, 24);
}


function setUpMainContainer(){
    let body = document.body;
    let container = document.createElement("div");
    container.id = "container";
    container.style.width = "1420px";
    container.style.height = "600px";
    body.appendChild(container);
    container.style.left = (body.offsetWidth - container.offsetWidth) / 2;
    container.style.top = (body.offsetHeight - container.offsetHeight) / 2;
}

function setUpMenuContainer(){
    let mainContainer = document.getElementById("container");
    let menuContainer = document.createElement("div");
    menuContainer.style.height = mainContainer.offsetHeight - 4 + "px";
    menuContainer.style.width = "200px";
    menuContainer.id = "menuContainer";
    mainContainer.appendChild(menuContainer);

    setUpAddNodeDiv();
    setUpAddEdgeDiv();
    setUpFunctionButtonsDiv();
    setUpLoadTemplates();
}

function setUpAddNodeDiv(){
    let menuContainer = document.getElementById("menuContainer");
    let addNodeDiv = document.createElement("div");
    addNodeDiv.id = "addNodeDiv";
    addNodeDiv.style.width = menuContainer.offsetWidth;
    addNodeDiv.style.height = "50px";
    menuContainer.appendChild(addNodeDiv);

    let textArea = document.createElement("input");
    textArea.setAttribute("type", "text");
    addNodeDiv.appendChild(textArea);
    textArea.style.top = (addNodeDiv.offsetHeight - textArea.offsetHeight) / 2 + "px";

    let addNodeButton = document.createElement("button");
    addNodeButton.innerHTML = "Add Node";
    addNodeDiv.appendChild(addNodeButton);
    addNodeButton.style.left = textArea.offsetWidth + textArea.offsetLeft + 10 + "px";
    addNodeButton.style.top = (addNodeDiv.offsetHeight - addNodeButton.offsetHeight) / 2 + "px";

    addNodeButton.onclick = function(){
        if(textArea.value == ""){
            return;
        }
        addNode(textArea.value);
        textArea.value = "";
    }
    textArea.onkeyup = function(event){
        if(event.keyCode == 13){
            if(textArea.value == ""){
                return;
            }
            addNode(textArea.value);
            textArea.value = "";
        }
    }


}


function setUpAddEdgeDiv(){
    //set up input area for node1
    let menuContainer = document.getElementById("menuContainer");
    let addEdgeDiv = document.createElement("div");
    let lastChildInMenu = menuContainer.lastChild;
    addEdgeDiv.id = "addEdgeDiv";
    addEdgeDiv.style.top = lastChildInMenu.offsetTop + lastChildInMenu.offsetHeight + 15 + "px";
    addEdgeDiv.style.width = menuContainer.offsetWidth;
    menuContainer.appendChild(addEdgeDiv);

    let textAreaDiv1 = document.createElement("div");
    textAreaDiv1.classList.add("textAreaDiv");
    let textNode1 = document.createElement("div");
    textNode1.classList.add("textNodeDiv");
    textNode1.innerHTML = "Node1: ";
    textAreaDiv1.appendChild(textNode1);
    addEdgeDiv.appendChild(textAreaDiv1);
    textNode1.style.top = (textAreaDiv1.offsetHeight - textNode1.offsetHeight) / 2 + "px";

    let textInput1 = document.createElement("input");
    textAreaDiv1.appendChild(textInput1)
    textInput1.style.left = textNode1.offsetLeft + textNode1.offsetWidth + 10 + "px";
    textInput1.style.top = (textAreaDiv1.offsetHeight - textInput1.offsetHeight) / 2 + "px";
    textInput1.style.width = textAreaDiv1.offsetWidth - textInput1.offsetLeft - 2 + "px";
    

    //set up input area for node2
    let textAreaDiv2 = document.createElement("div");
    textAreaDiv2.classList.add("textAreaDiv");
    let textNode2 = document.createElement("div");
    textNode2.classList.add("textNodeDiv");
    textNode2.innerHTML = "Node2: ";
    textAreaDiv2.appendChild(textNode2);
    addEdgeDiv.appendChild(textAreaDiv2);
    textAreaDiv2.style.top = textAreaDiv1.offsetTop + textAreaDiv1.offsetHeight;
    textNode2.style.top = (textAreaDiv2.offsetHeight - textNode2.offsetHeight) / 2 + "px";

    let textInput2 = document.createElement("input");
    textAreaDiv2.appendChild(textInput2)
    textInput2.style.left = textNode2.offsetLeft + textNode2.offsetWidth + 10 + "px";
    textInput2.style.top = (textAreaDiv2.offsetHeight - textInput2.offsetHeight) / 2 + "px";
    textInput2.style.width = textAreaDiv2.offsetWidth - textInput2.offsetLeft - 2 + "px";

    //set up input area for edge weight
    let textAreaDiv3 = document.createElement("div");
    textAreaDiv3.classList.add("textAreaDiv");
    let textNode3 = document.createElement("div");
    textNode3.classList.add("textNodeDiv");
    textNode3.innerHTML = "Edge Weight:";
    textNode3.style.fontSize = "14";
    textAreaDiv3.appendChild(textNode3);
    addEdgeDiv.appendChild(textAreaDiv3);
    textAreaDiv3.style.top = textAreaDiv2.offsetTop + textAreaDiv2.offsetHeight;
    textNode3.style.top = (textAreaDiv3.offsetHeight - textNode3.offsetHeight) / 2 + "px";

    let textInput3 = document.createElement("input");
    textAreaDiv3.appendChild(textInput3)
    textInput3.style.left = textNode3.offsetLeft + textNode3.offsetWidth + 10 + "px";
    textInput3.style.top = (textAreaDiv3.offsetHeight - textInput3.offsetHeight) / 2 + "px";
    textInput3.style.width = textAreaDiv3.offsetWidth - textInput3.offsetLeft - 2 + "px";
    

    let addEdgeButton = document.createElement("button");
    addEdgeDiv.appendChild(addEdgeButton);
    addEdgeButton.innerHTML = "Add Edge"
    addEdgeButton.style.top = textAreaDiv3.offsetTop + textAreaDiv3.offsetHeight + 2 + "px";
    addEdgeButton.style.left = (addEdgeDiv.offsetWidth - addEdgeButton.offsetWidth) / 2 + "px";
    
    addEdgeButton.onclick = function(){
        let input1 = textInput1.value;
        let input2 = textInput2.value;
        let weight = textInput3.value;   
        if(input1 == "" || input2 == "" || weight == ""){
            return;
        }
        if(addEdge(weight, input1, input2)){
            textInput1.value = "";
            textInput2.value = "";
            textInput3.value = "";
        }
    }

    textInput1.onkeyup = function(event){
        if(event.keyCode == 13){
            textInput2.focus();
        }
    }

    textInput2.onkeyup = function(event){
        if(event.keyCode == 13){
            textInput3.focus();
        }
    }

    textInput3.onkeyup = function(event){
        if(event.keyCode == 13){
            let input1 = textInput1.value;
            let input2 = textInput2.value;
            let weight = textInput3.value;   
            if(input1 == "" || input2 == "" || weight == ""){
                return;
            }
            if(addEdge(weight, input1, input2)){
                textInput1.value = "";
                textInput2.value = "";
                textInput3.value = "";
                textInput1.focus();
                return;
            }
            if(!nodesMap.has(input1)){
                textInput1.focus();
            }else{
                textInput2.focus();
            }
        }
    }


}


function setUpFunctionButtonsDiv(){
    let menuContainer = document.getElementById("menuContainer");
    let lastChildInMenu = menuContainer.lastChild;
    let buttonsDiv = document.createElement("div");
    let lastButtonChild = undefined;
    buttonsDiv.id = "buttonsDiv";
    menuContainer.appendChild(buttonsDiv);
    buttonsDiv.style.top = lastChildInMenu.offsetHeight + lastChildInMenu.offsetTop + 15 + "px";

 
    let primButton = document.createElement("button");
    primButton.innerHTML = "Prim's Algorithm";
    buttonsDiv.appendChild(primButton);
    primButton.style.left = (buttonsDiv.offsetWidth - primButton.offsetWidth) / 2 + "px";
    primButton.style.top = "5px";

    primButton.onclick = function(){
        if(startNode == undefined){
            alert("pick your start node by double clicking");
            return;
        }
        var prim = new Prim(startNode, numOfNodes);
        prim.findPath();
    }

    let clearMarkedEdgesButton = document.createElement("button");
    clearMarkedEdgesButton.innerHTML = "clear marked edges";
    lastButtonChild = buttonsDiv.lastChild;
    buttonsDiv.appendChild(clearMarkedEdgesButton);
    clearMarkedEdgesButton.style.left = (buttonsDiv.offsetWidth - clearMarkedEdgesButton.offsetWidth) / 2 + "px";
    clearMarkedEdgesButton.style.top = lastButtonChild.offsetTop + lastButtonChild.offsetHeight + 10 +"px";
    

    clearMarkedEdgesButton.onclick = function(){
        unmarkVisitedEdges();
    }

    
    let removeAllEdgesButton = document.createElement("button");
    removeAllEdgesButton.innerHTML = "remove all edges";
    lastButtonChild = buttonsDiv.lastChild;
    buttonsDiv.appendChild(removeAllEdgesButton);
    removeAllEdgesButton.style.left = (buttonsDiv.offsetWidth - removeAllEdgesButton.offsetWidth) / 2 + "px";
    removeAllEdgesButton.style.top = lastButtonChild.offsetTop + lastButtonChild.offsetHeight + 10 +"px";

    
    removeAllEdgesButton.onclick = function(){
        removeAllEdges();
    }

    let removeAllNodesButton = document.createElement("button");
    removeAllNodesButton.innerHTML = "remove all nodes";
    lastButtonChild = buttonsDiv.lastChild;
    buttonsDiv.appendChild(removeAllNodesButton);
    removeAllNodesButton.style.left = (buttonsDiv.offsetWidth - removeAllNodesButton.offsetWidth) / 2 + "px";
    removeAllNodesButton.style.top = lastButtonChild.offsetTop + lastButtonChild.offsetHeight + 10 + "px";

    removeAllNodesButton.onclick = function(){
        removeAllNodes();
    }
}


function setUpLoadTemplates(){
    let menuContainer = document.getElementById("menuContainer");
    let lastChildInMenu = menuContainer.lastChild;
    let templatesDiv = document.createElement("div");
    let lastChild = undefined;
    templatesDiv.id = "loadTemplates";
    menuContainer.appendChild(templatesDiv);
    templatesDiv.style.top = lastChildInMenu.offsetTop + lastChildInMenu.offsetHeight + 15 + "px";

    let titleDiv = document.createElement("div");
    titleDiv.innerHTML = "templates to start";
    templatesDiv.appendChild(titleDiv);
    titleDiv.style.height = "20px";
    titleDiv.style.backgroundColor = "inherit";

    let node_6_button =document.createElement("button");
    lastChild = templatesDiv.lastChild;
    templatesDiv.appendChild(node_6_button);
    node_6_button.innerHTML = "6 nodes";
    node_6_button.style.left = (templatesDiv.offsetWidth - node_6_button.offsetWidth) / 2 + "px";
    node_6_button.style.top = lastChild.offsetTop + lastChild.offsetHeight + 5 + "px";

    node_6_button.onclick = function(){
        loadTemplate(0);
    }

    let node_5_button =document.createElement("button");
    lastChild = templatesDiv.lastChild;
    templatesDiv.appendChild(node_5_button);
    node_5_button.innerHTML = "5 nodes";
    node_5_button.style.left = (templatesDiv.offsetWidth - node_5_button.offsetWidth) / 2 + "px";
    node_5_button.style.top = lastChild.offsetTop + lastChild.offsetHeight + 5 + "px";

    node_5_button.onclick = function(){
        loadTemplate(1);
    }
}

function loadTemplate(index){
    
    //remove all the existed nodes and edges from the table first
    //removeAllNodes();
    removeAllNodes();
    removeAllEdges();
    nodesMap = new Map();
    edges = new Map();
    startNode = undefined;

    for(let [node_val, position] of Object.entries(templatePositions[index])){
        addNodeWithPosition(node_val, position[0], position[1]);
    }

    
}

function setUpTableContainer(){
    let mainContainer = document.getElementById("container");
    let menuContainer = document.getElementById("menuContainer");
    let tableContainer = document.createElement("div");
    tableContainer.id = "tableContainer";
    mainContainer.appendChild(tableContainer);
    tableContainer.style.height = mainContainer.offsetHeight;
    tableContainer.style.width = mainContainer.offsetWidth - menuContainer.offsetWidth;
    tableContainer.style.top = 0;
    tableContainer.style.left = menuContainer.offsetLeft + menuContainer.offsetWidth;

}

function createTable(r, column){
    var tableContainer = document.querySelector("#tableContainer");
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
    tableContainer.appendChild(table);
}




function addNodeWithPosition(value, i, j){
    if(nodesMap.has(value)){
        alert("node existed")
        return;
    }
    let container = document.querySelector("#tableContainer");
    let node = document.createElement("div");
    node.classList.add("node");
    node.innerHTML = value;
    var availableCell = document.getElementById(i + "-" + j);

    container.appendChild(node);
    node.style.left = availableCell.offsetLeft;
    node.style.top = availableCell.offsetTop;
    //intialize an empty array for neighbors 
    node.id = value;
    node.edges = new Array();
    nodesMap.set(value, node);
    node.value = value;

    numOfNodes ++;

    node.ondblclick = function(){
        if(startNode != undefined){
            startNode.classList.remove("startNode");
        }
        startNode = node;
        node.classList.add("startNode");
        //let e = document.querySelectorAll(".edge");
        //console.log(e);
    }

    new MouseDrag(node);
}



function addNode(value){
    if(nodesMap.has(value)){
        alert("node existed")
        return;
    }
    let container = document.querySelector("#tablecontainer");
    let node = document.createElement("div");
    node.classList.add("node");
    node.innerHTML = value;
    var availableCell = availableCells.shift();

    container.appendChild(node);
    node.style.left = availableCell.offsetLeft;
    node.style.top = availableCell.offsetTop;
    //intialize an empty array for neighbors 
    node.id = value;
    
    node.edges = new Array();
    nodesMap.set(value, node);
    node.value = value;

    numOfNodes ++;

    node.ondblclick = function(){
        if(startNode != undefined){
            startNode.classList.remove("startNode");
        }
        startNode = node;
        node.classList.add("startNode");
    }

    new MouseDrag(node);
}

function addEdge(weight, nodeA_value, nodeB_value){
    if(!nodesMap.has(nodeA_value) || !nodesMap.has(nodeB_value)){
        alert("node does not exist, please add node first");
        return false;
    }

    //if edge between two target nodes already exists, then there's no need to create
    //anther edge, just simply update it
    if(edges.has(nodeA_value + nodeB_value)){
        let edge = edges.get(nodeA_value + nodeB_value);
        let textNode = edge.querySelector(".textNode");
        textNode.innerHTML = weight;
        edge.weight = weight;
        return;
        
    }

    weight = parseInt(weight);
    var nodeA = nodesMap.get(nodeA_value);
    var nodeB = nodesMap.get(nodeB_value);
    var edgeId = "edge" + edgeIndex.toString();

    //create the edge
    var edge = document.createElement("div");
    var textNode = document.createElement("div");
    textNode.innerHTML = weight;
    textNode.classList.add("textNode");
    edge.appendChild(textNode);
    edge.id = edgeId;
    edge.weight = weight;
    edge.classList.add("edge");

    //setting two sides of an edge
    edge.nodeA = nodeA;
    edge.nodeB = nodeB;

    //add edges to nodes  
    nodeA.edges.push(edge);
    nodeB.edges.push(edge);

    //add edge to edges map 
    edges.set(nodeA_value + nodeB_value, edge);
    edges.set(nodeB_value + nodeA_value, edge);

    //increment edgeIndex
    edgeIndex++;

    setEdgePosition(edge);

    return true;
}


function setEdgePosition(edge){
    var nodeA = edge.nodeA;
    var nodeB = edge.nodeB;
    var container = document.getElementById("tableContainer");
    var center1_x = nodeA.offsetWidth/2 + nodeA.offsetLeft;
    var center1_y = nodeA.offsetHeight/2 + nodeA.offsetTop;
    var center2_x = nodeB.offsetWidth/2 + nodeB.offsetLeft;
    var center2_y = nodeB.offsetHeight/2 + nodeB.offsetTop;
   
    edge.style.height = distance(center1_x, center2_x, center1_y, center2_y) + "px";
    container.appendChild(edge);
    edge.style.left = center1_x;
    edge.style.top = center1_y;
    edge.style.transformOrigin = "0 0";
    var degree = computeDegree(center1_x, center2_x, center1_y, center2_y);
    edge.style.transform = "rotate(" + degree.toString() + "deg)";

    var textNode = edge.querySelector(".textNode");
    textNode.style.top = edge.offsetHeight / 2;
    textNode.style.transformOrigin = "0 0";

    if(center1_x >= center2_x){
        textNode.style.transform = "rotate(-90deg)";
    }else{
        textNode.style.transform = "rotate(90deg)";
    }

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

//unmark all visitedEdges
function unmarkVisitedEdges(){
    var visitedEdges = document.querySelectorAll(".visitedEdge");
    visitedEdges.forEach(visitedEdge => {
        visitedEdge.classList.remove("visitedEdge");
    })
}


//remove all existed edges
function removeAllEdges(){
    var allEdges = document.querySelectorAll(".edge");
    var tableContainer = document.querySelector("#tableContainer");
    allEdges.forEach(edge => {
        tableContainer.removeChild(edge);
    })
   
    edges = new Map();

    //remove edges from each Node Div Object
    var allNodes = document.querySelectorAll(".node");
    allNodes.forEach(node => {
        node.edges = new Array();
    })
}

function removeAllNodes(){
    var allNodes = document.querySelectorAll(".node");
    var tableContainer = document.querySelector("#tableContainer");
    allNodes.forEach(node => {
        tableContainer.removeChild(node);
    })
}

//to clear a single edge
function clearEdge(edgeId){
    var edge = document.getElementById(edgeId);
    var mainDiv = document.querySelector("#container");
    mainDiv.removeChild(edge);
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

    this.node.edges.forEach(edge =>{
        setEdgePosition(edge);
    })
}

MouseDrag.prototype.mouseLeave = function(){
    this.node.onmousemove = null;
}   

MouseDrag.prototype.mouseUp = function(){
    this.node.onmousemove = null;
}

