import {Dialog} from "../Dialog";

export class Speaker {
    blabla: Dialog[];
    name: string;
    currentDialogIndex: number;

    constructor(name: string) {
        this.name = name;
        this.currentDialogIndex = 0;
    }
    public speak():void{
        this.blabla[this.currentDialogIndex].play();
    }
    public setCurrentDialogIndex(index:number):void{
        this.currentDialogIndex = index;
    }

}