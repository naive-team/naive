import {Speaker} from "./Speaker";
import {Line} from "../Line";
import {ChoiceLine} from "../ChoiceLine";
import {AbstractLine} from "../AbstractLine";
import {Dialog} from "../Dialog";
import * as GUI from "@babylonjs/gui";

export class CALISpeaker extends Speaker {
    constructor(uiGlobale : GUI.AdvancedDynamicTexture) {
        super("C.A.L.I");
        this.defBlabla(uiGlobale);
    }
    private defBlabla(uiGlobale : GUI.AdvancedDynamicTexture):void {
    let welcome: Line = new Line("Bonjour, je m'appelle C.A.L.I. Ravie de faire ta connaissance !",

        new ChoiceLine(
            "mais on dirait qu'on est coincées ici... si tu veux je peux ouvir la porte.",
            [
                "oui, s'il te plait",
                "je préfère faire par moi même"
            ],
            [
                new Line("d'acc je fais ça", null),
                new Line ("Je suis là si tu as besoin de moi", null),
            ],

        ),

    );
    let dialogWelcome: Dialog = new Dialog(uiGlobale, welcome);
    this.blabla = [dialogWelcome];
    }
}