
function Prim(startNode, size){
    this.startNode = startNode;
    this.upcomingEdges = new PriorityQueue(128, function(edge1, edge2){
        return edge1.weight < edge2.weight;
    }, false)
    this.visitedNodes = new CustomArray();
    this.size = size;
    this.totalWeight = 0;
}

Prim.prototype.findPath = function(){
    let cur = this.startNode;
    this.visitedNodes.push(cur);
    cur.edges.forEach(edge =>{
        //console.log(cur, cur.edges);
        this.upcomingEdges.push(edge);
    })
    let _this = this;
    new Promise((resolve, reject) =>{
        var interval = setInterval(function(){
            if(_this.visitedNodes.length == _this.size || _this.upcomingEdges.empty()){
                clearInterval(interval);
                resolve();
            }else{
                let newEdge = _this.upcomingEdges.pop();
                //console.log(newEdge);
                if(_this.visitedNodes.has(newEdge.nodeA) && !_this.visitedNodes.has(newEdge.nodeB)){
                    _this.visitedNodes.push(newEdge.nodeB);
                    _this.addToUpcomingEdges(newEdge.nodeB);
                    _this.totalWeight += newEdge.weight;
                    cur = newEdge.nodeB;
                    newEdge.classList.add("visitedEdge");
                }
                else if(!_this.visitedNodes.has(newEdge.nodeA) && _this.visitedNodes.has(newEdge.nodeB)){
                    _this.visitedNodes.push(newEdge.nodeA);
                    _this.addToUpcomingEdges(newEdge.nodeA);
                    _this.totalWeight += newEdge.weight;
                    cur = newEdge.nodeA;
                    newEdge.classList.add("visitedEdge");
                }
            }
        }, 400)
    }).then(() =>{
        _this.helper();
    })
}

Prim.prototype.addToUpcomingEdges = function(node){
    node.edges.forEach(edge => {
        this.upcomingEdges.push(edge);
    })
}


Prim.prototype.helper = function(){
    console.log("total weight is", this.totalWeight);
}


class CustomArray extends Array{
    has(target){
        for(let i = 0; i < this.length; i++){
            if(this[i] == target)
                return true;
        }
        return false;
    }
}
