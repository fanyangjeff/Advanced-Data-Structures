//compare is a callback function that compares two elements defined by the user
//To make a min priority queue, define compare like compare = function(data1, data2){return data1 < data2}
//To make a max priority queue, define compare like compare = function(data1, data2){return data1 > data2}
//explained in terms of a minimum priority queue. 
function PriorityQueue(size, compare){
    this.maxSize = size;
    this.queue = new Array(this.maxSize);
    this.curIndex = -1;
    this.compare = compare;
}

PriorityQueue.prototype.push = function(value){
    this.curIndex++;
    //first append the incoming value at the end of current queue
    this.queue[this.curIndex] = value;
    var cur = this.curIndex;
    var parentIndex = this.getParentIndex(cur);

    //compare with its parent value. Loop terminates when it either reaches the root, 
    //or its parents' value is less than its value

    while(parentIndex >= 0 && this.compare(this.queue[cur], this.queue[parentIndex])){
        let temp = this.queue[cur];
        this.queue[cur] = this.queue[parentIndex];
        this.queue[parentIndex] = temp;
        cur = parentIndex;
        parentIndex = this.getParentIndex(cur);
    }
}

PriorityQueue.prototype.pop = function(){
    if(this.curIndex < 0){
        return undefined;
    }
    //store the root value, need to return this at the end of the function
    var returnedVal = this.queue[0];
    //move the last element in the queue to the top
    this.queue[0] = this.queue[this.curIndex];
    this.curIndex --;
    var cur = 0;

    
    while(true){
        
        let leftChildIndex = this.getLeftChildIndex(cur);
        let rightChildIndex = this.getRightChildIndex(cur);

        //case1: the current node does not have any child, terminate loop immediately
        if(leftChildIndex > this.curIndex){
            break;
        }

        //case2: the current node has exactly one child (the left Child)
        else if(leftChildIndex == this.curIndex){
            //if the left child has a smaller value, then exchange with it and 
            //set cur = leftChildIndex
            if(this.compare(this.queue[leftChildIndex], this.queue[cur])){
                let temp = this.queue[leftChildIndex];
                this.queue[leftChildIndex] = this.queue[cur];
                this.queue[cur] = temp;
                cur = leftChildIndex;
                continue;
            }
            //otherwise, terminate the loop
            break;
        }
        
        //compare left Child value and right Child value, take the smaller one
        let smallerValueIndex = leftChildIndex;
        if(this.compare(this.queue[rightChildIndex], this.queue[leftChildIndex])){
            smallerValueIndex = rightChildIndex;
        }

        //case 3: if current node's value is less than the smaller value between its children,
        //then terminate the loop
        if(this.compare(this.queue[cur], this.queue[smallerValueIndex])){
            break;
        }
        //otherwise, exchange witht the smallest value, and set cur = smllerValueIndex
        let temp = this.queue[cur];
        this.queue[cur] = this.queue[smallerValueIndex];
        this.queue[smallerValueIndex] = temp;
        cur = smallerValueIndex;
    }

    return returnedVal;

}

PriorityQueue.prototype.getParentIndex = function(index){
    return Math.floor((index - 1) / 2)
}

PriorityQueue.prototype.getLeftChildIndex = function(index){
    return (index + 1) * 2 - 1;
}

PriorityQueue.prototype.getRightChildIndex = function(index){
    return (index + 1) * 2;
}

PriorityQueue.prototype.empty = function(){
    return this.curIndex == -1;
}

PriorityQueue.prototype.printQueue = function(){
    for(let i = 0; i < this.curIndex + 1; i++){
        console.log(this.queue[i]);
    }
}