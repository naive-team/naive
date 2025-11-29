import {InputStrategy} from "./InputStrategy";
import {Scalar} from "@babylonjs/core";
import {Printer} from "../util/Printer";
import {Button} from "./Button";

enum KeyCode {
    KeyW = "KeyW",
    KeyA = "KeyA",
    KeyS = "KeyS",
    KeyD = "KeyD",
    ShiftLeft = "ShiftLeft",
    Space = "Space",
    Enter = "Enter"
}

export class KeyboardInput implements InputStrategy {
    private inputMap_: Record<string, boolean> = {};
    private readonly keydownHandler_: (e: KeyboardEvent) => void;
    private readonly keyupHandler_: (e: KeyboardEvent) => void;

    private horizontal1_: number = 0;
    private horizontal2_: number = 0;
    private vertical1_: number = 0;
    private vertical2_: number = 0;

    private static readonly ALLOWED_KEY_CODES: Set<string> = new Set<string>(Object.keys(KeyCode).map(k => (KeyCode as any)[k]));

    private mapping_ : Record<Button, KeyCode> = {
        A: KeyCode.Space,
        B: KeyCode.ShiftLeft,
        DOWN: KeyCode.KeyS,
        LEFT: KeyCode.KeyA,
        RIGHT: KeyCode.KeyD,
        START: KeyCode.Enter,
        UP: KeyCode.KeyW
    }

    constructor() {
        this.keydownHandler_ = (e) => {
            if (! KeyboardInput.ALLOWED_KEY_CODES.has(e.code)) return;
            this.inputMap_[e.code] = true;
        };
        this.keyupHandler_ = (e) => {
            if (! KeyboardInput.ALLOWED_KEY_CODES.has(e.code)) return;
            this.inputMap_[e.code] = false;
        }
    }

    attach(): InputStrategy {
        window.addEventListener("keydown", this.keydownHandler_);
        window.addEventListener("keyup", this.keyupHandler_);

        return this;
    }

    detach(): void {
        window.removeEventListener("keydown", this.keydownHandler_);
        window.removeEventListener("keyup", this.keyupHandler_);
    }

    private isPressed_(button: Button): boolean {
        return this.inputMap_[this.mapping_[button]];
    }

    aButtonPressed(): boolean {
        return this.isPressed_(Button.A);
    }

    bButtonPressed(): boolean {
        return this.isPressed_(Button.B);
    }

    startButtonPressed(): boolean {
        return this.isPressed_(Button.START);
    }

    getHorizontal1(): number {
        return this.horizontal1_;
    }

    getHorizontal2(): number {
        return this.horizontal2_;
    }

    getVertical1(): number {
        return this.vertical1_;
    }

    getVertical2(): number {
        return this.vertical2_;
    }

    update(): void {
        if (this.isPressed_(Button.LEFT)) {
            this.horizontal1_ = Scalar.Lerp(this.horizontal1_, -1, 0.2);
            Printer.print("Left pressed", this.horizontal1_);
        }
        if (this.isPressed_(Button.RIGHT)) {
            this.horizontal1_ = Scalar.Lerp(this.horizontal1_, 1, 0.2);
            Printer.print("Right pressed", this.horizontal1_);
        }
        if (this.isPressed_(Button.UP)) {
            this.vertical1_ = Scalar.Lerp(this.vertical1_, 1, 0.2);
            Printer.print("Up pressed", this.vertical1_);
        }
        if (this.isPressed_(Button.DOWN)) {
            this.vertical1_ = Scalar.Lerp(this.vertical1_, -1, 0.2);
            Printer.print("Down pressed", this.vertical1_);
        }

        Printer.print(this.inputMap_);
    }
}