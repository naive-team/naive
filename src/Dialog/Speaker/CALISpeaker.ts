import {Speaker} from "./Speaker";
import {Line} from "../Line";
import {ChoiceLine} from "../ChoiceLine";
import {Dialog} from "../Dialog";
import * as GUI from "@babylonjs/gui";
import {AbstractMesh, Scene, Vector3} from "@babylonjs/core";
import {DialogGraph, DialogNode} from "../DialogNode";

export class CALISpeaker extends Speaker {
    // TODO changer expression ?

    constructor(uiGlobale : GUI.AdvancedDynamicTexture, mesh :AbstractMesh, scene:Scene, playermesh: AbstractMesh) {

        super("C.A.L.I", mesh, scene, playermesh);

        this.defBlabla(uiGlobale);
        this.collider_.position = new Vector3(3, 0, 0);
        this.collider_.rotation = new Vector3(0, 268, 0);
        this.collider_.scaling = new Vector3(0.4, 0.4, 0.4);


    }
    private defBlabla(uiGlobale : GUI.AdvancedDynamicTexture):void {
    let welcome: Line = new Line("Bonjour, je m'appelle C.A.L.I. Enchantée de faire ta connaissance !",
        new Line("Mais on dirait qu'on est coincées ici... tu veux que j'ouvre la porte ?",
            new ChoiceLine(
                "",
                [
                    "Oui, s'il te plait !",
                    "Non, je préfère me débrouiller.",
                ],
                [
                    new Line("d'acc je fais ça !", null),
                    new Line ("Je suis là si tu as besoin de moi...", null),
                ],

            )
        )
        ,

    );
    let needsommehelp : Line = new Line ("Alors besoin d'aide finalement ?",
        new ChoiceLine(
            "",
            [
                "Oui, s'il te plait !",
                "Non, toujours pas.",
                "C.A.L.I., c'est ça ? "
            ],
            [
                new Line("d'acc je fais ça !", null),
                new Line ("Je suis là si tu as besoin de moi...", null),
                new Line("Oui, ça veut dire Chat Assistant Loyal et Intelligent ! ", null),
            ],
        )

    );

    let tuto1 : Line = new Line ("ok alors tu vas faire...", null);

    let dialogWelcome: Dialog = new Dialog(uiGlobale, welcome, 0);

    let dialoguetuto1: Dialog = new Dialog(uiGlobale, tuto1, 1);

    let dialogNeddSommeHelp : Dialog = new Dialog(uiGlobale, needsommehelp,2);

    let nodewelcome : DialogNode = {
            // Node 0 — intro, le choix 0=accepter → node 1, choix 1=refuser → node 2
            dialog: dialogWelcome,
            choiceTransitions: new Map([
                [0, 1],  // joueur choisit "Accepter" → on va au node 1
                [1, 2],  // joueur choisit "Refuser"  → on va au node 2
            ]),
        };
    let nodeneedsommehelp : DialogNode = {dialog: dialogNeddSommeHelp,
        choiceTransitions: new Map([
            [0, 1]
        ]),
        defaultNext: 2}

        let nodetuto1 : DialogNode = {dialog: dialoguetuto1, defaultNext: 1};
    this.dialogGraph.setNodes([nodewelcome, nodetuto1, nodeneedsommehelp]);
    }
}