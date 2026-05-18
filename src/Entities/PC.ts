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

    private static readonly alphabet_: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    private static readonly jsKeyCodeToLetter_: Map<string, string> = PC.initKeyCodeToLetter();

    static initKeyCodeToLetter(): Map<string, string> {
        const result: Map<string, string> = new Map<string, string>();

        for (const letter of PC.alphabet_) {
            const key: string = "Key" + letter.toUpperCase();
            const value: string = letter;

            result.set(key, value);
        }

        return result;
    }

    constructor() {
        this.collider_ = MeshBuilder.CreateBox("PC", {size: 0.3});
        this.collider_.checkCollisions = false;
        this.collider_.position.y = 1

        this.state_ = PCState.OFF;
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

        for (const jsKeyCode of PC.jsKeyCodeToLetter_.keys()) {
            if (input.getPressed(jsKeyCode)) {
                this.content_ += PC.jsKeyCodeToLetter_.get(jsKeyCode);
                console.log(this.content_);
            }
        }
    }

    public turnOn(): void {
        this.state_ = PCState.ON;
    }

    public turnOff(): void {
        this.state_ = PCState.OFF;
    }
}