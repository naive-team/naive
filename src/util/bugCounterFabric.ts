import {BugCounter} from "../UI/BugCounter";
import {Fireflycounter} from "../UI/Fireflycounter";

export class BugCounterFabric {
    // les conteurs doivent etre uniques !
    static bugCounter:BugCounter;
    static fireflyCounter:Fireflycounter;
    static initialize():void {
        this.bugCounter = new BugCounter();
        this.fireflyCounter = new Fireflycounter();
    }
    static getBugCounter(){
        return this.bugCounter;
    }
    static getFireflyCounter(){
        return this.fireflyCounter;
    }
}