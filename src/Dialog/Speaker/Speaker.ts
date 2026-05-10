import {Dialog} from "../Dialog";
import {Scene} from "@babylonjs/core";

export class Speaker {
    blabla: Dialog[];
    name: string;
    currentDialogIndex: number;

    constructor(name: string) {
        this.name = name;
        this.currentDialogIndex = 0;
    }
    public speak(scene:Scene):void{
        this.blabla[this.currentDialogIndex].play(scene);
    }
    public setCurrentDialogIndex(index:number):void{
        this.currentDialogIndex = index;
    }

}