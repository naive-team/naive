import {AbstractLine} from "./AbstractLine";
import * as GUI from "@babylonjs/gui";
import {LineUi} from "./LineUi";
import {Scene} from "@babylonjs/core";

export class Dialog {
    currentLine: AbstractLine;
    uiGlobale : GUI.AdvancedDynamicTexture;
    dialogueUI : LineUi;
    private _started : boolean;

    constructor(uiGlobale : GUI.AdvancedDynamicTexture, firstLine: AbstractLine) {
        this.uiGlobale = uiGlobale;
        this.currentLine = firstLine;
        this._started = false;
    }
    async play(scene:Scene): Promise<void> {
        console.log("entre dans dialogue play");
        this.dialogueUI = new LineUi(this.uiGlobale);

        do {
            this.currentLine.createUi(this.uiGlobale);
            this.dialogueUI.setSpeakerName("C.A.L.I.");
            this.currentLine.setLineUi(this.dialogueUI);

            if (this.currentLine.getText() !== "") {
                this.dialogueUI.animation(scene, this.currentLine.getText());
            }

            this.currentLine.display();

            if (!this.currentLine.hasNext()) {
                await this.currentLine.getNextLine();
                break;
            }

            const nextLine = await this.currentLine.getNextLine();
            this.currentLine.hide();
            this.currentLine = nextLine;

        } while (true);

        this.currentLine.hide();
        this.dialogueUI.hide();
    }

    get started(): boolean {
        return this._started;
    }

    set started(value: boolean) {
        this._started = value;
    }
}