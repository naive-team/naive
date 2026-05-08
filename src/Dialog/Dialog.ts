import {AbstractLine} from "./AbstractLine";
import * as GUI from "@babylonjs/gui";
import {LineUi} from "./LineUi";
import {Line} from "./Line";
import {ChoiceLine} from "./ChoiceLine";

export class Dialog {
    currentLine: AbstractLine;
    uiGlobale : GUI.AdvancedDynamicTexture;
    dialogueUI : LineUi;

    constructor(uiGlobale : GUI.AdvancedDynamicTexture, firstLine: AbstractLine) {
        this.uiGlobale = uiGlobale;
        this.currentLine = firstLine;
    }
    async play(): Promise<void> {
        console.log("entre dans dialogue play")
        this.dialogueUI = new LineUi(this.uiGlobale);
       /* while(this.currentLine.hasNext()){
            this.currentLine.createUi(this.uiGlobale);
            this.dialogueUI.setText(this.currentLine.getText());
            this.currentLine.display();
            let nextLine:AbstractLine = await this.currentLine.getNextLine();
            this.currentLine.hide();
            this.currentLine = nextLine;
        }*/
        do {
            this.currentLine.createUi(this.uiGlobale);
            this.dialogueUI.setSpeakerName("C.A.L.I.");
            if (this.currentLine.getText() !== ""){
                this.dialogueUI.setText(this.currentLine.getText());
            }
            this.currentLine.display();

            if (!this.currentLine.hasNext()) break;

            const nextLine = await this.currentLine.getNextLine();
            this.currentLine.hide();
            //this.currentLine.dispose();
            this.currentLine = nextLine;
        } while (true);
        this.currentLine.hide();
        this.dialogueUI.hide();
}
}