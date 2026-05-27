import {Entity} from "./interfaces/Entity";
import {EntityFamily} from "./util/EntityFamily";
import {
    AbstractMesh,
    MeshBuilder,
    StandardMaterial,
    DynamicTexture,
    Scene,
    ActionManager,
    ExecuteCodeAction, Vector3
} from "@babylonjs/core";
import {GameContext} from "../util/GameContext";
import {Input} from "../Input/Input";
import {Command} from "../Commands/Command";
import {CommandConverter} from "../Commands/CommandConverter";
import {Commandable} from "./interfaces/Commandable";
import {Color} from "../Commands/Color";
import {ColorConverter} from "../Commands/ColorConverter";
import {InteractUI} from "../UI/interactUI";
import {InteractTrigger} from "../util/InteractTrigger";

enum PCState {
    OFF,
    ON
}

const MAX_LINE_LENGTH: number = 16;
const MAX_LINE: number = 9;
const TEXT_PCT: number = 3/4;

export class PC implements Entity {
    private collider_: AbstractMesh;
    private content_: {text: string, color: string}[];

    private state_: PCState;

    private mesh_: AbstractMesh;
    private screen_: AbstractMesh;
    private texture_: DynamicTexture;
    private font_: string;
    private exitFlag_: boolean = false;
    private ui: InteractUI;

    constructor(mesh: AbstractMesh, playercollider: AbstractMesh = MeshBuilder.CreateBox("defaut collider", {size: 0}), scene:Scene) {
        this.mesh_ = mesh;

        const scaling: number = 0.2;

        this.mesh_.scaling.x = scaling;
        this.mesh_.scaling.y = scaling;
        this.mesh_.scaling.z = scaling;

        this.collider_ = MeshBuilder.CreateBox("PC", {size: 1});
        this.collider_.checkCollisions = false;

        //this.collider_.visibility = 0.5;
        this.collider_.visibility = 0;

        this.mesh_.parent = this.collider_;
        this.mesh_.position.z = -0.8

        this.collider_.position.y = 1

        const scaling2: number = 2;

        this.collider_.scaling.x = scaling2;
        this.collider_.scaling.y = scaling2;
        this.collider_.scaling.z = scaling2;

        this.state_ = PCState.OFF;

        this.content_ = [{text: "", color: "white"}];;

        this.screen_ = this.mesh_.getChildMeshes(false, (mesh: AbstractMesh) => {return mesh.name === "screen"})[0];

        this.mesh_.getChildMeshes(false, (mesh: AbstractMesh) => {return mesh.name === "Cube"})[0].dispose();

        const texture = new DynamicTexture("screenTexture", {height: 384, width: 512}, this.collider_.getScene());
        this.texture_ = texture;
        const screenMaterial = new StandardMaterial("screenMaterial", this.collider_.getScene());

        screenMaterial.diffuseTexture = texture;
        screenMaterial.backFaceCulling = false;
        this.screen_.material = screenMaterial;

        const size: number = 44 * TEXT_PCT;
        this.font_ = `bold ${size}px monospace`;
        //InteractTrigger.init(playercollider, scene, this.collider_,new InteractUI("Démarrer"), async (scene) => this.turnOn() )
        this.ui = new InteractUI("Démarrer")
        this.initTriger(playercollider, scene, this.ui);

    }
    initTriger(playerMesh: AbstractMesh, scene:Scene, ui:InteractUI) {
        const targetMesh = this.collider_;
        let isInside = false;

        targetMesh.actionManager = new ActionManager(scene);

        // Entrée
        targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {trigger: ActionManager.OnIntersectionEnterTrigger, parameter: playerMesh},
                (): void => {
                    isInside = true;
                    ui.show();
                }
            )
        );

        // Sortie
        targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {trigger: ActionManager.OnIntersectionExitTrigger, parameter: playerMesh},
                (): void => {
                    isInside = false;
                    ui.hide();
                }
            )
        );
    }

    getCollider(): AbstractMesh {
        return this.collider_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.PC;
    }

    update(ctx: GameContext): void {
        switch(this.state_) {
            case PCState.OFF:
                break;
            case PCState.ON:
                this.handleInput_(ctx);
        }
    }

    private handleInput_(ctx: GameContext): void {
        const input: Input = ctx.input;

        const output: string = input.updateTypeKeyboard();

        if (output === "") return;

        let lastIndex: number = this.content_.length - 1;
        const currentLine: string =  this.content_[lastIndex].text;

        if (output === "Backspace") {
            if (currentLine === "") {
                if (lastIndex === 0) return;
                this.content_.pop();
                this.updateScreen_();
                return;
            }
            else {
                this.content_[lastIndex].text = currentLine.slice(0, currentLine.length - 1);
                this.updateScreen_();
                return;
            }
        }
        if (output === "Enter") {
            this.executeCommand_(ctx, this.content_[lastIndex].text);
            this.content_.push({text: "", color: "white"});
            if (this.content_.length > MAX_LINE) {
                this.content_ = [{text: "", color: "white"}];
            }
            return; }
        if (output === "Space") {this.content_[lastIndex].text += " "; this.updateScreen_(); return; }

        if (currentLine.length > Math.ceil(MAX_LINE_LENGTH / TEXT_PCT)) {
            this.content_.push({text: "", color: "white"});
            if (this.content_.length > MAX_LINE) {
                this.clearScreen_();
                lastIndex = 0;
            }
        }

        this.content_[lastIndex].text += output;

        this.updateScreen_();
        console.log(this.content_);

    }

    private updateScreen_(): void {
        const context = this.texture_.getContext();

        context.fillStyle = "black";
        context.fillRect(0, 0, 512, 384);

        for (let i: number=0; i < this.content_.length; i++) {
            this.texture_.drawText(this.content_[i].text, 45 * TEXT_PCT, 75 + i * 50 * TEXT_PCT, this.font_, this.content_[i].color, null, false, true);
        }

    }

    public turnOn(): void {
        this.state_ = PCState.ON;
        this.exitFlag_ = false;
        this.ui.hide();
    }

    public turnOff(): void {
        this.state_ = PCState.OFF;
        this.ui.show();
    }

    private executeCommand_(ctx: GameContext, text: string): void {
        const tokens: string[] = text.split(" ");

        if (tokens[0] === "help") {
            if ( ! tokens[1] ) {
                this.clearScreen_();
                this.writeLine_("COMMANDS", "yellow");
                this.writeLine_("======== ", "yellow");
                this.writeLine_("• move ");
                this.writeLine_("• help");
                this.writeLine_("");
                this.writeLine_("Try this :");
                this.writeLine_("help move", "yellow");
                this.writeLine_("");
                return;
            }

            else if (tokens[1] === "move") {
                this.clearScreen_();
                this.writeLine_("SYNTAX", "yellow");
                this.writeLine_("======", "yellow");
                this.writeLine_("<targ> move <dir> <dist>");
                this.writeLine_("");
                this.writeLine_("EXAMPLE");
                this.writeLine_("=======");
                this.writeLine_("yellow move north 1", "yellow");
                this.writeLine_("");
                return;

            }


        }


        const color: Color = ColorConverter.fromString(tokens[0]);


        const command: Command = CommandConverter.fromString(tokens[1]);

        if (command === null) {
            this.writeLine_("ERROR: write a command", "red");
            return;
        }

        const args: string[] = [];

        for (const arg of tokens.slice(2)) {
            args.push(arg);
        }

        const target: Commandable = ctx.entityManager.getCommandableByColor(color);
        if (target === undefined) {
            this.writeLine_("ERROR: Target not found");
            return;
        }


        const msg: string = target.execute(ctx, command, args);

        if (msg === "OK") {
            this.writeLine_(msg, "lime");
            this.exit_();
        }
        else if (msg.startsWith("<targ>")) {
            this.writeLine_(msg, "yellow");
        }
        else {
            this.writeLine_(msg, "red");
        }


    }

    private writeLine_(text: string, color: string = "white") {
        this.content_.push({text, color});
        this.updateScreen_();
    }

    private exit_(): void {
        this.exitFlag_ = true;
    }

    getExitFlag(): boolean {
        return this.exitFlag_;
    }

    private clearScreen_(): void {
        this.content_ = [{text: "", color: "white"}];

        const context = this.texture_.getContext();

        context.fillStyle = "black";
        context.fillRect(0, 0, 512, 384);
    }

    public setPosition(x, y,z){
        this.collider_.position = new Vector3(x, y, z);
    }

}