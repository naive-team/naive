import {AbstractLine} from "./AbstractLine";
import * as GUI from "@babylonjs/gui";
import {LineUi} from "./LineUi";
import {Line} from "./Line";
import {ChoiceLine} from "./ChoiceLine";
import {Scene} from "@babylonjs/core";

export class Dialog {
    currentLine: AbstractLine;
    uiGlobale : GUI.AdvancedDynamicTexture;
    dialogueUI : LineUi;

    constructor(uiGlobale : GUI.AdvancedDynamicTexture, firstLine: AbstractLine) {
        this.uiGlobale = uiGlobale;
        this.currentLine = firstLine;
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

            // On attend toujours l'interaction utilisateur, même sur la dernière ligne
            if (!this.currentLine.hasNext()) {
                await this.currentLine.getNextLine(); // ou getNextLine() si ça gère déjà ça
                break;
            }

            const nextLine = await this.currentLine.getNextLine();
            this.currentLine.hide();
            this.currentLine = nextLine;

        } while (true);

        this.currentLine.hide();
        this.dialogueUI.hide();
}
}