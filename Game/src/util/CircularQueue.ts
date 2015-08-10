
/**
 * Created by Paha on 7/25/2015.
 * Circular Queue implementation so we can remove the cost
 * of splicing arrays.
 */
class CircularQueue<T>{
    private queue:T[] = [];
    private currIndex:number = 0;
    private startIndex:number = 0;

    constructor(private length:number){
        for(var i=0;i<length;i++)
            this.queue.push(null);
    }

    /**
     * Adds a piece of data to this queue.
     * @param data The data to add.
     * @returns {boolean} True if the data was added, false otherwise.
     */
    add(data:T):boolean{
        if(this.isFull()) return false;
        this.queue[this.currIndex] = data; //Set data
        this.currIndex = (this.currIndex+1)%this.length; //Increment index
        return true;
    }

    /**
     * Pops the first piece of data off of the queue and returns it.
     * @returns {any} The data that was popped, or null if the queue was empty.
     */
    popFirst():T{
        if(this.isEmpty()) return null;
        var data:T = this.queue[this.startIndex]; //Get the data from the end.
        this.startIndex = (this.startIndex+1)%this.length; //Increment the index;
        return data;
    }

    /**
     * @returns {boolean} True if full, false otherwise.
     */
    isFull():boolean{
        return (this.currIndex+1)%this.length == this.startIndex;
    }

    /**
     * @returns {boolean} True if empty, false otherwise.
     */
    isEmpty():boolean{
        return this.currIndex == this.startIndex;
    }
}

export default CircularQueue;