import {Speaker} from "./Speaker";
import {Line} from "../Line";
import {ChoiceLine} from "../ChoiceLine";
import {Dialog} from "../Dialog";
import * as GUI from "@babylonjs/gui";
import {AbstractMesh, Scene, Tools, Vector3} from "@babylonjs/core";
import {DialogNode} from "../DialogNode";
import {Entity} from "../../Entities/interfaces/Entity";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {GameContext} from "../../util/GameContext";
import {TextureSwitcher} from "../../util/TextureSwitcher";
import {CaliFaces} from "../../util/CaliFaces";
import {CalifaceSwitcher} from "../../util/CalifaceSwitcher";
import {LabScene} from "../../Scenes/LabScene";
import {Commandable} from "../../Entities/interfaces/Commandable";
import {EntityManager} from "../../Entities/util/EntityManager";
import {Door} from "../../Entities/Door";
import {Block} from "../../Entities/Block";

export class CALISpeaker extends Speaker implements Entity {

    private interactionCounter:number = 0;
    private califaceSwitcher:CalifaceSwitcher;
    private entityManager:EntityManager;

    constructor(uiGlobale : GUI.AdvancedDynamicTexture, mesh :AbstractMesh, scene:Scene, playermesh: AbstractMesh, entityManager:EntityManager) {

        super("C.A.L.I", mesh, scene, playermesh);

        this.defBlabla(uiGlobale);

        this.collider_.position = new Vector3(5.5, 0.8, 2.1);
        this.collider_.rotation._y = Tools.ToRadians(149.2);
        this.collider_.scaling = new Vector3(0.4, 0.4, 0.4);
        this.collider_.isVisible = false;

        let faceMesh = mesh.getChildMeshes()[1];
        this.califaceSwitcher = new CalifaceSwitcher(faceMesh, scene);

        CaliFaces.initialize(scene);

        this.entityManager = entityManager;
    }
    override async interact(scene: Scene){
        if (scene instanceof LabScene) (scene as LabScene).switchMusic();

        await super.interact(scene);
        this.interactionCounter ++;
        //console.log(this.interactionCounter);

        if (scene instanceof LabScene) (scene as LabScene).switchMusic();

    }
    private defBlabla(uiGlobale : GUI.AdvancedDynamicTexture):void {
        let thxThenNormal = ()=>{this.califaceSwitcher.switchThenNormalFace(CaliFaces.thxFace)};
        let winkThenNormal = ()=>{this.califaceSwitcher.switchThenNormalFace(CaliFaces.winkFace)};
        let starThenNormal = ()=>{this.califaceSwitcher.switchThenNormalFace(CaliFaces.starFace)};

        let sadThenNormal = ()=>{this.califaceSwitcher.switchThenNormalFace(CaliFaces.sadFace)};

        let bigbrain = ()=>{this.califaceSwitcher.applyMatrixEffect();}

        let openDoor = (id:string)=>{
           let entity = this.entityManager.getEntityById(id);
           const door:Door = entity as Door;
            setTimeout(()=>{door.open()}, 1000);
        }
        let resolveDevRoomBloc = ()=>{
            let entity1 = this.entityManager.getEntityById("block1");
            const bloc1:Block = entity1 as Block;

            let entity2 = this.entityManager.getEntityById("block2");
            const bloc2:Block = entity2 as Block;

            bloc1.setPosition(6.5,-0.3,-12.3);
            bloc2.setPosition(6.5,-0.3,-9.6);
        };

        /// -------- LINES ------------
        let tuto1 : Line = new Line ("D'acc on fait ça !",
            new Line ("Alors d'abord, il faut aller chercher une LUCIOLE ENERGETIQUE",
                new Line ("Tu devrais en trouver une dans un coin...",
                    new Line ("Appuie sur [ESPACE] pour utiliser ton filet ;)", null, winkThenNormal)
                )
            )
        );
        let tuto1loop : Line = new Line ("Tu veux que je répète ?",
            new ChoiceLine("",
                [
                    "Une Luciole énergétique ?",
                    "Comment capturer un insecte ?",
                ],
                [
                    new Line("C'est une petite besiole qui fait de la lumiere. Tu en trouvera une dans la salle.", null, starThenNormal),
                    new Line("Appuie sur [ESPACE] pour utiliser ton filet ;)", null, winkThenNormal)
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
                        new Line ("Je suis là si tu as besoin de moi...", null, thxThenNormal),
                    ],

                ),
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
                new Line ("Je suis là si tu as besoin de moi...", null,thxThenNormal),
                new Line("Oui, ça veut dire Chaton Assistant Loyal et Intelligent ! ", null, winkThenNormal),
            ],
        )

    );

    let tuto2 : Line = new Line ("Besoin d'aide ?",
        new ChoiceLine("",
            ["Je fais quoi avec la luciole ?",
            "Non, rien en fait."
            ],
            [
                new Line("Il suffit de l'accrocher à la porte !",
                    new ChoiceLine("",
                        [
                            "L'accrocher ?",
                            "D'accord !"],
                        [
                            new Line("Oui pour cela il suffit d'appuyer sur le bouton [F].", null),
                            new Line("Ok, à+ !", null, winkThenNormal),
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
                new Line("Nyahaha, c'est sûr, parler à cette boite de conserve c'est plus relou qu'un adorable chaton comme moi ;)",
                    new Line("Tu veux que je m'en charge ?",
                        new ChoiceLine("",
                            [
                                "Oui s'il te plait !",
                                "Comment le faire par moi-même ?",
                                "Nan je me débrouille."
                            ],
                            [
                                new Line("Oki je fais ça !", null, ()=>{
                                    bigbrain();
                                    openDoor("door_to_dev");
                                }),
                                new Line("L'ordinateur fonctionne avec des commandes simples(?). Tu trouveras les détails de syntaxe en écrivant \"help\" dans le terminal",
                                    new ChoiceLine("",
                                        [
                                            "Comment on ouvre le terminal déjà ?",
                                            "Merci C.A.L.I !"
                                        ],
                                        [
                                            howtoOpenTerminal,
                                            new Line ("Y'a pas de quoi ^u^", null, thxThenNormal)
                                        ]
                                    )
                                ),
                                new Line("Okidoki !", null)
                            ]
                        )
                    ),
                    winkThenNormal
                ),
                new Line("Okidoki !", null)
            ]
        )
    );

    let letsGO:Line = new Line ("La porte est ouverte ! On peut avancer maintenant", null, starThenNormal);

    let anotherDoor :Line = new Line("On dirait bien que la prochaine porte est bloquée aussi... ",
        new Line("Heureusement il y a encore un ordi dans cette salle... et on a toujours la luciole !",
            null, starThenNormal)
    );
    let tutoBloc1 :Line= new Line("Besoin d'aide ?",
        new ChoiceLine("",
            [
                "Je peux pas placer la luciole sur la porte...",
                "C'est quoi ces objets ?",
                "Nan,rien..."
            ],
            [
                new Line ("C'est un problème courrant !",
                    new Line("Il y a une porte de sécurité devant... ce type de porte n'a pas la même source d'énergie.",
                        new Line ("Il y a une double sécurité pour pouvoir l'ouvrir.",
                            new Line("Tu veux que je t'explique ?",
                                new ChoiceLine("",
                                    [
                                        "Oui steuplait",
                                        "Tu peux pas juste l'actionner toi ?",
                                        "Non, ça ira"
                                    ],
                                    [
                                        new Line("Il y a deux boutons à actionner. Pour les activer en même temps, tu va pouvoir utiliser les bloc.",
                                            new Line("Les bloc sont déplaçables grace à l'énergie des lucioles.",null
                                            )
                                        ),
                                        new Line("Oui je peux !",
                                            new Line("Alors je fais ça ?",
                                                new ChoiceLine("",
                                                    [
                                                        "Oui steuplait",
                                                        "Non, finalement"
                                                    ],
                                                    [
                                                        new Line("D'acc je fais ça !", null, ()=>{
                                                                setTimeout(resolveDevRoomBloc, 1000);
                                                                //TODO attendre un peu avant big brain ?
                                                                bigbrain();
                                                            }
                                                        ),
                                                        new Line("OK...", null, thxThenNormal)
                                                    ]
                                                )
                                            )
                                        ),
                                        new Line ("D'acc...",null, sadThenNormal)
                                    ]
                                )
                            )
                        )
                    )
                ),
                new ChoiceLine("",
                    [
                        "Les blocs",
                        "Les boutons",
                        "Nan rien"
                    ],
                    [
                        new Line("Les bloc sont déplaçables grace à l'énergie des lucioles.",null),
                        new Line ("Les boutons activent des trucs quand on appuie dessus", null),
                        new Line ("D'acc...",null,sadThenNormal)

                    ]
                ),
                new Line ("Je suis là si tu as besoin de moi...",null, thxThenNormal)
            ]
        ),
        winkThenNormal
    );
    let secureDoorOpen:Line = new Line ("La porte de sécurité est ouverte !",
        new Line("Plus qu'a ouvrir la porte avec la luciole !",
            new ChoiceLine("",
                [
                    "Tu peux le faire ?",
                    "YATTA !"
                ],
                [
                    new Line("Il faut d'abbord accrocher la luciole à la porte pour que je puisse l'acctionner...", null, sadThenNormal),
                    new Line("YATTA !", null, starThenNormal)
                ]
            )
        )
    );
    let openTheDoor: Line = new Line("Besoin d'aide ?",
        new ChoiceLine("",
            [
                "Tu peux ouvrir la porte ?",
                "C'est quoi la commende déja ?",
                "Non rien"
            ],
            [
                new Line("D'acc je fais ça !", null, ()=>{openDoor("door_to_serv")}),
                new Line("Une fois dans le terminal, tape `yellow open`", null),
                new Line("Oki !", null, thxThenNormal)
            ]
        )
    );

    let sayonara : Line = new Line ("Mon programme ne me permet pas aller plus loin...",
        new Line("Désolé tu vas devoir continuer sans moi..." , null, sadThenNormal)
    );

/// -------- Dialogs ------------

    let dialogWelcome: Dialog = new Dialog(uiGlobale, welcome, 0);

    let dialoguetuto1: Dialog = new Dialog(uiGlobale, tuto1loop, 1);

    let dialogNeddSommeHelp : Dialog = new Dialog(uiGlobale, needsommehelp,2);

    let dialogTuto2 : Dialog = new Dialog(uiGlobale, tuto2, 4);

    let dialogTuto3 :Dialog = new Dialog(uiGlobale, tuto3, 5);

    let dialogTuto4 : Dialog = new Dialog(uiGlobale, tuto4, 4);

    let dialogAnotherDoor = new Dialog(uiGlobale, anotherDoor, 7);

    let dialogBloc1 = new Dialog(uiGlobale, tutoBloc1, 7);

    let dialogLetsGo = new Dialog(uiGlobale, letsGO, 8);

    let dialogSecureDoorOpen = new Dialog(uiGlobale, secureDoorOpen, 1);

    let DialogOpenTheDoor = new Dialog(uiGlobale, openTheDoor, 1);

    let dialogSayonara = new Dialog(uiGlobale, sayonara,1);

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

    let nodeTuto3 :DialogNode = {dialog: dialogTuto3,
        choiceTransitions: new Map([
            [1, 4]
        ]),
        defaultNext: 5};

    let nodeTuto4:DialogNode = {dialog: dialogTuto4, defaultNext: 5};

    let nodeAnotherDoor : DialogNode = {dialog: dialogAnotherDoor, defaultNext:7};

    let nodeTutoBloc1 : DialogNode = {dialog:dialogBloc1, defaultNext:7};

    let nodeLetsGo : DialogNode = {dialog: dialogLetsGo, defaultNext:8};

    let nodeSecureDoorOpen : DialogNode= {dialog: dialogSecureDoorOpen, defaultNext:9};

    let nodeOpentheDoor: DialogNode = {dialog:DialogOpenTheDoor, defaultNext:10};

    let nodeSayonara = {dialog:dialogSayonara, defaultNext:11};

    this.dialogGraph.setNodes(
        [
            nodewelcome, nodetuto1, nodeneedsommehelp, nodeTuto2, nodeTuto3, nodeTuto4,
            nodeAnotherDoor, nodeTutoBloc1, nodeLetsGo, nodeSecureDoorOpen, nodeOpentheDoor,
            nodeSayonara
        ]
    );

    }

    getInteractionCounter(){
        return this.interactionCounter;
    }
    getCollider(): AbstractMesh {
        return this.collider_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.CALI;
    }

    update(_ctx: GameContext): void {
    }

    getId(): string {
        return "caliSpeaker";
    }
}