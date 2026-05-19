import {Entity} from "./interfaces/Entity";
import {EntityFamily} from "./util/EntityFamily";
import {AbstractMesh, MeshBuilder, Scene} from "@babylonjs/core";
import {GameContext} from "../util/GameContext";
import {Input} from "../Input/Input";

enum PCState {
    OFF,
    ON
}

export class PC implements Entity {
    private collider_: AbstractMesh;
    private content_: string;

    private state_: PCState;

    private mesh_: AbstractMesh;

    constructor(mesh: AbstractMesh) {
        this.mesh_ = mesh;

        const scaling: number = 0.2;

        this.mesh_.scaling.x = scaling;
        this.mesh_.scaling.y = scaling;
        this.mesh_.scaling.z = scaling;

        this.collider_ = MeshBuilder.CreateBox("PC", {size: 1});
        this.collider_.checkCollisions = false;


        this.collider_.visibility = 0.5;

        this.mesh_.parent = this.collider_;
        this.mesh_.position.z = -0.8

        this.collider_.position.y = 1

        this.state_ = PCState.OFF;

        this.content_ = "";
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

        if (output === "Backspace") {this.content_ = this.content_.slice(0, this.content_.length - 1); console.log(this.content_); return;}
        if (output === "Enter") {this.content_ += "\n"; console.log(this.content_); return; }
        if (output === "Space") {this.content_ += " "; console.log(this.content_); return; }

        this.content_ += output;
        console.log(this.content_);

    }

    public turnOn(): void {
        this.state_ = PCState.ON;
    }

    public turnOff(): void {
        this.state_ = PCState.OFF;
    }
}