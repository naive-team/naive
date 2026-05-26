import {Entity} from "./interfaces/Entity";
import {EntityFamily} from "./util/EntityFamily";
import {AbstractMesh, MeshBuilder, StandardMaterial, DynamicTexture} from "@babylonjs/core";
import {GameContext} from "../util/GameContext";
import {Input} from "../Input/Input";
import {Command} from "../Commands/Command";
import {CommandConverter} from "../Commands/CommandConverter";
import {Commandable} from "./interfaces/Commandable";
import {Color} from "../Commands/Color";
import {ColorConverter} from "../Commands/ColorConverter";

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

    constructor(mesh: AbstractMesh) {
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
                this.content_ = [{text: "", color: "white"}];
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
    }

    public turnOff(): void {
        this.state_ = PCState.OFF;
    }

    private executeCommand_(ctx: GameContext, text: string): void {
        const tokens: string[] = text.split(" ");

        const color: Color = ColorConverter.fromString(tokens[0]);
        const command: Command = CommandConverter.fromString(tokens[1]);
        const args: string[] = [];

        for (const arg of tokens.slice(2)) {
            args.push(arg);
        }

        const target: Commandable = ctx.entityManager.getCommandableByColor(color);
        if (target === undefined) return;


        const msg: string = target.execute(ctx, command, args);

        if (msg === "OK") {
            this.writeLine_(msg, "lime");
        }
        else {
            this.writeLine_(msg, "red");
        }


    }

    private writeLine_(text: string, color?: string) {
        this.content_.push({text, color});
        this.updateScreen_();
    }

}