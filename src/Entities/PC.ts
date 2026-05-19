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

    constructor() {
        this.collider_ = MeshBuilder.CreateBox("PC", {size: 0.3});
        this.collider_.checkCollisions = false;
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