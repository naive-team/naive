 import {AbstractLine} from "./AbstractLine";
import * as GUI from "@babylonjs/gui";
import {LineUi} from "./LineUi";
import {Scene} from "@babylonjs/core";
import {ChoiceLine} from "./ChoiceLine";

export class Dialog {
    firstLine : AbstractLine;
    currentLine: AbstractLine;
    uiGlobale : GUI.AdvancedDynamicTexture;
    dialogueUI : LineUi;
    public nextDialogIndex: number;
    private _started : boolean;
    private actionOnFinish : (choiceIndex: number)=>void;

    constructor(uiGlobale : GUI.AdvancedDynamicTexture, firstLine: AbstractLine,  nextDialogIndex :number, actionOnFinish:(choiceIndex: number)=>void = (_choiceIndex: number)=>{}) {
        this.uiGlobale = uiGlobale;
        this.firstLine = firstLine;
        this._started = false;
        this.nextDialogIndex = nextDialogIndex;
        this.actionOnFinish = actionOnFinish;
    }
    async play(scene: Scene): Promise<number | undefined> {
        this.dialogueUI = new LineUi(this.uiGlobale);
        this.currentLine = this.firstLine;
        let lastChoiceIndex: number | undefined = undefined;

        while (true) {
            this.currentLine.createUi(this.uiGlobale);
            this.dialogueUI.setSpeakerName("C.A.L.I."); // todo en fait ca devrai pas etre def ici ca ...
            this.currentLine.setLineUi(this.dialogueUI);

            if (this.currentLine.getText() !== "") {
                this.dialogueUI.animation(scene, this.currentLine.getText());
            }

            this.currentLine.display();

            // Récupère la prochaine ligne (attend le clic ou le choix)
            const nextLine = await this.currentLine.getNextLine();

            // Capture le choix si c'était un ChoiceLine
            if (this.currentLine instanceof ChoiceLine) {
                lastChoiceIndex = this.currentLine.lastChoiceIndex;
            }

            this.currentLine.hide();

            if (nextLine === null || nextLine === undefined) {
                break; // fin du dialogue
            }

            this.currentLine = nextLine;
        }

        this.dialogueUI.hide();
        this._started = false;
        this.actionOnFinish(lastChoiceIndex);
        return lastChoiceIndex;
    }

    get started(): boolean {
        return this._started;
    }

    set started(value: boolean) {
        this._started = value;
    }
}