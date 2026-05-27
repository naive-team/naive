import {Dialog} from "../Dialog";
import {AbstractMesh, ActionManager, ExecuteCodeAction, MeshBuilder, Scene} from "@babylonjs/core";
import {DialogGraph} from "../DialogNode";

export class Speaker {
    dialogGraph: DialogGraph = new DialogGraph();
    name: string;
    currentDialogIndex: number;
    mesh : AbstractMesh;
    collider_ : AbstractMesh;
    private wantsToSpeak_: boolean = false;

    constructor(name: string, mesh: AbstractMesh, _scene: Scene, _playermesh: AbstractMesh) {
        this.name = name;
        this.currentDialogIndex = 0;
        this.mesh = mesh;
        this.mesh.getChildMeshes().forEach(child => {
            child.checkCollisions = true;
        });
        this.mesh.checkCollisions = true;
        this.collider_ = MeshBuilder.CreateBox("speaker_collider", {
            width: 4,
            depth: 3,
            height: 4
        });
        this.collider_.isVisible = true;
        this.mesh.parent = this.collider_;
        //this.init(playermesh, scene);

        //this.setRegisterDialog(scene);

    }
    async interact(scene: Scene) {

        const dialog = this.dialogGraph.getCurrentDialog();
        if (!dialog.started) {
            console.log("starting dialog");
            dialog.started = true;
            this.wantsToSpeak_ = true;
            const choiceIndex = await dialog.play(scene);
            dialog.started = false;
            this.wantsToSpeak_ = false;
            this.dialogGraph.transitionTo(choiceIndex);
        }
    }
    public speak(_scene:Scene):void {
        //this.dialogGraph[this.currentDialogIndex].play(scene);
    }
    public setCurrentDialogIndex(index:number):void{
        this.currentDialogIndex = index;
    }

    protected init(playerMesh: AbstractMesh, scene: Scene): void {
        const targetMesh = this.collider_;

        console.log("ActionManager sur:", targetMesh.name, "vertices:", targetMesh.getTotalVertices());

        targetMesh.actionManager = new ActionManager(scene);
        targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: playerMesh
                },
                async (): Promise<void> => {
                    await this.interact(scene);
                }
            )
        );
    }

    public wantsToSpeak(): boolean {
        return this.wantsToSpeak_;
    }Lo
}