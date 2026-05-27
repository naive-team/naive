import {Speaker} from "./Speaker";
import {Line} from "../Line";
import {ChoiceLine} from "../ChoiceLine";
import {Dialog} from "../Dialog";
import * as GUI from "@babylonjs/gui";
import {AbstractMesh, Scene, Vector3} from "@babylonjs/core";
import {DialogNode} from "../DialogNode";
import {Entity} from "../../Entities/interfaces/Entity";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {GameContext} from "../../util/GameContext";

export class CALISpeaker extends Speaker implements Entity {
    // TODO changer expression ?
    // vaut le coup seulment si cam est bien centree
    //  bloquer inputs

    private interactionCounter:number = 0;
    constructor(uiGlobale : GUI.AdvancedDynamicTexture, mesh :AbstractMesh, scene:Scene, playermesh: AbstractMesh) {

        super("C.A.L.I", mesh, scene, playermesh);

        this.defBlabla(uiGlobale);
        //this.init(playermesh, scene);
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

        /// -------- LINES ------------
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

    let tuto2 : Line = new Line ("Besoin d'aide ?",
        new ChoiceLine("",
            ["Je fais quoi avec la luciole ?",
            "Non, rien en fait."
            ],
            [
                new Line("Il suffit de l'accorcher à la porte !",
                    new ChoiceLine("",
                        [
                            "L'accorcher ?",
                            "D'accord !"],
                        [
                            new Line("Oui pour cela il suffit d'appuyer sur le bouton []", null),
                            new Line("Ok, à+ !", null)
                        ]
                    )
                ),
                new Line("Okidoki !", null)
            ])
    )
        let howtoOpenTerminal:Line =  new Line ("Pour ouvrir le terminal, clique sur [F] quand tu es proche de l'ordi.",null);

        let tuto3 : Line = new Line ("Besoin d'aide ?",
        new ChoiceLine("",
            [
                "Et maintenant ?",
                "Non, en fait."
            ],
            [
                new Line("Comme la porte est de nouveau alimentée en énergie, on va pouvoir l'ouvrir !",
                    new Line("Tu vois l'ordinateur beige contre le mur ? Il permet de contrôler les objets imprégnés d'Énergie.",
                        new Line("Il suffit de lui dire d'ouvir la porte !",
                           howtoOpenTerminal
                        )
                    )
                ),
                new Line("D'accodac !", null)
                ]
        )
    )
        let tuto4 : Line = new Line ("Besoin d'aide ?",
            new ChoiceLine ("",
                [
                    "Comment on \"parle\" à un ordi ?",
                    "Nope !"
                ],
                [
                    new Line("Nyahaha, c'est sur que converser avec cette boite de conserve c'est plus relou qu'un adorable chaton comme moi ;)",
                        new Line("Tu veux que je m'en charge ?",
                            new ChoiceLine("",
                                [
                                    "Oui s'il te plait !",
                                    "J'aimerais des indications pour le faire moi même.",
                                    "Nan je me débrouille."
                                ],
                                [
                                    new Line("Oki je fais ça !", null), // TODO lancer animation et unlock porte
                                    new Line("L'ordinateur fonctionne avec des commandes simples (?). Tu trouveras les détails de syntaxe en écrivant \"help\" dans le terminal",
                                        new ChoiceLine("",
                                            [
                                                "Comment on ouvre le terminal déjà ?",
                                                "Merci C.A.L.I !"
                                            ],
                                            [
                                                howtoOpenTerminal,
                                                new Line ("Y'a pas de quoi ^u^", null)
                                            ]
                                        )
                                    ),
                                    new Line("Okidoki !", null)
                                ]
                            )
                        )
                    )
                ]
            )
        )

        let anotherDoor :Line = new Line("On dirait bien que la prochaine porte est bloquée aussi... Heureusement il y a encore des lucioles et un ordi dans cette salle...", null)

        /// -------- Dialogs ------------

    let dialogWelcome: Dialog = new Dialog(uiGlobale, welcome, 0);

    let dialoguetuto1: Dialog = new Dialog(uiGlobale, tuto1loop, 1);

    let dialogNeddSommeHelp : Dialog = new Dialog(uiGlobale, needsommehelp,2);

    let dialogTuto2 : Dialog = new Dialog(uiGlobale, tuto2, 4);

    let dialogTuto3 :Dialog = new Dialog(uiGlobale, tuto3, 5);

    let dialogTuto4 : Dialog = new Dialog(uiGlobale, tuto4, 2);

        /// -------- Dialog Nodes ------------

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
        defaultNext: 2
    }

    let nodetuto1 : DialogNode = {dialog: dialoguetuto1, defaultNext: 1};

    let nodeTuto2 : DialogNode = {dialog: dialogTuto2, defaultNext: 3};

    let nodeTuto3 :DialogNode = {dialog: dialogTuto3, defaultNext: 4};

    let nodeTuto4:DialogNode = {dialog: dialogTuto4, defaultNext: 5};

    this.dialogGraph.setNodes([nodewelcome, nodetuto1, nodeneedsommehelp, nodeTuto2, nodeTuto3, nodeTuto4]);
    }

    getCollider(): AbstractMesh {
        return this.collider_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.CALI;
    }

    update(_ctx: GameContext): void {
    }
}