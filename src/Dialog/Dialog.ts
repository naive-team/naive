import {AbstractLine} from "./AbstractLine";
import * as GUI from "@babylonjs/gui";
import {LineUi} from "./LineUi";
import {Line} from "./Line";
import {ChoiceLine} from "./ChoiceLine";

export abstract class Dialog {
    // TODO stoquer line 1
    // definir toutes les lines
    // afficher
    firstLine: AbstractLine;
    currentLine: AbstractLine;
    Lines: AbstractLine[];
    uiGlobale : GUI.AdvancedDynamicTexture;
    dialogueUI : LineUi;


    async play(): Promise<void> {
        this.dialogueUI = new LineUi(this.uiGlobale);
        while(this.currentLine.hasNext()){
            this.dialogueUI.setText(this.currentLine.getText());
            await this.currentLine.getNextLine();
        }
}
    lines(): void {
        let welcome: Line = new Line("Bonjour, je m'appelle C.A.L.I. Ravie de faire ta connaissance !",
            new Line (
            "mais on dirait qu'on est coincées ici... si tu veux je peux ouvir la porte.",
            new ChoiceLine(
                [
               "oui, s'il te plait",
                "je prefere faire par moi meme"
                ],
                [
                    new Line("d'acc je fais ça", null),
                    new Line ("Je suis là si tu as besoin de moi", null)
                ],
            this.uiGlobale
            )
            )
        );
    }
}