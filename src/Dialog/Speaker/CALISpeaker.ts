import {Speaker} from "./Speaker";
import {Line} from "../Line";
import {ChoiceLine} from "../ChoiceLine";
import {Dialog} from "../Dialog";
import * as GUI from "@babylonjs/gui";
import {AbstractMesh, Scene, Vector3} from "@babylonjs/core";
import {DialogGraph, DialogNode} from "../DialogNode";

export class CALISpeaker extends Speaker {
    // TODO changer expression ?
    // vaut le coup seulment si cam est bien centree
    //  bloquer inputs

    private interactionCounter:number = 0;
    constructor(uiGlobale : GUI.AdvancedDynamicTexture, mesh :AbstractMesh, scene:Scene, playermesh: AbstractMesh) {

        super("C.A.L.I", mesh, scene, playermesh);

        this.defBlabla(uiGlobale);
        this.init(playermesh, scene);
        this.collider_.position = new Vector3(3, 0, 0);
        this.collider_.rotation = new Vector3(0, 268, 0);
        this.collider_.scaling = new Vector3(0.4, 0.4, 0.4);
        this.collider_.isVisible = false;


    }
    override async interact(_scene: Scene){
        await super.interact(_scene);
        this.interactionCounter ++;
        console.log(this.interactionCounter);

    }
    private defBlabla(uiGlobale : GUI.AdvancedDynamicTexture):void {
        let tuto1 : Line = new Line ("D'acc on fait ça !",
            new Line ("Alors d'abord, il faut aller chercher une LUCIOLE ENERGETIQUE",
                new Line ("Tu devrais en trouver une dans un coin...",
                    new Line ("Appuie sur [ESPACE] pour utiliser ton filet ;)", null))
            )
        );
        let tuto1loop : Line = new Line ("Tu veux que je répète ?",
            new ChoiceLine("",
                [
                    "Une Luciole énergétique ?",
                    "Comment capturer un insecte ?",
                ],
                [
                    new Line("C'est une petite besiole qui fait de la lumiere. Tu en trouvera une dans la salle.", null),
                    new Line("Appuie sur [ESPACE] pour utiliser ton filet ;)", null)
                ]
            )
        )
        let welcome: Line = new Line("Bonjour, je m'appelle C.A.L.I. Enchantée de faire ta connaissance !",
            new Line("On dirait qu'on est coincées ici... mais ne t'inquète pas, je peux t'aider !",
                new ChoiceLine(
                    "",
                    [
                        "Oui, s'il te plait !",
                        "Non, je préfère me débrouiller.",
                    ],
                    [
                        tuto1,
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
                tuto1,
                new Line ("Je suis là si tu as besoin de moi...", null),
                new Line("Oui, ça veut dire Chaton Assistant Loyal et Intelligent ! ", null),
            ],
        )

    );



    let dialogWelcome: Dialog = new Dialog(uiGlobale, welcome, 0);

    let dialoguetuto1: Dialog = new Dialog(uiGlobale, tuto1loop, 1);

    let dialogNeddSommeHelp : Dialog = new Dialog(uiGlobale, needsommehelp,2);

    let nodewelcome : DialogNode = {
            dialog: dialogWelcome,
            choiceTransitions: new Map([
                [0, 1],
                [1, 2],
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