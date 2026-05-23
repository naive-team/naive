import {Vector2, Scalar} from "@babylonjs/core";
import {KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_UP} from "./Keys";
import {KeyState} from "./KeyState";
import {JsKeyCodeToRealKeyStrategy} from "./JsKeyCodeToRealKeyStrategies/JsKeyCodeToRealKeyStrategy";
import {JsKeyCode} from "./JsKeyCode";
import {TYPABLE_KEYS, TypableKey} from "./TypableKey";
import {JsKeyCodeToAzerty} from "./JsKeyCodeToRealKeyStrategies/JsKeyCodeToAzerty";
import {JsKeyCodeToQwerty} from "./JsKeyCodeToRealKeyStrategies/JsKeyCodeToQwerty";



export class Input {
    private readonly keyPressed_: Record<JsKeyCode, boolean>;
    private keyPressedLastFrame_: Record<JsKeyCode, boolean>;
    private readonly keyStates_: Record<JsKeyCode, KeyState>;


    private inputVector_: Vector2 = new Vector2(0, 0);
    private jsKeyCodeToRealKeyStrategy_: JsKeyCodeToRealKeyStrategy;

    constructor() {
        this.keyPressed_ = {};
        this.keyPressedLastFrame_ = {};
        this.keyStates_ = {};

        window.addEventListener("keydown", (key) =>  {
            this.keyPressed_[key.code] = true;
        });

        window.addEventListener("keyup", (key) => {
            this.keyPressed_[key.code] = false;
        });

        this.jsKeyCodeToRealKeyStrategy_ = new JsKeyCodeToAzerty();
    }

    public getPressed(jsKeyCode: JsKeyCode): boolean {
        const result = this.keyPressed_[jsKeyCode];

        if (result === undefined) return false;

        return result;
    }

    public getJustPressed(jsKeyCode: JsKeyCode): boolean {
        const result: KeyState = this.keyStates_[jsKeyCode];

        if (result === undefined) return false;

        return result === KeyState.JUST_PRESSED;
    }

    public getReleased(jsKeyCode: JsKeyCode): boolean {
        const result: KeyState = this.keyStates_[jsKeyCode];

        if (result === undefined) return false;

        return result === KeyState.RELEASED;
    }



    public update(): void {
        this.updateKeyStates_();
        this.updateKeyPressedLastFrame_();
        this.updateInputVector_();
    }

    private updateKeyPressedLastFrame_() {
        for (const key in this.keyPressed_) {
            this.keyPressedLastFrame_[key] = this.keyPressed_[key];
        }
    }

    private updateKeyStates_() {
        for (const key in this.keyPressed_) {
            if (!this.keyPressedLastFrame_[key] && this.keyPressed_[key]) {
                this.keyStates_[key] = KeyState.JUST_PRESSED;
            } else if (this.keyPressedLastFrame_[key] && this.keyPressed_[key]) {
                this.keyStates_[key] = KeyState.PRESSED;
            } else if (this.keyPressedLastFrame_[key] && (!this.keyPressed_[key])) {
                this.keyStates_[key] = KeyState.RELEASED;
            } else if (!this.keyPressedLastFrame_[key] && (!this.keyPressed_[key])) {
                this.keyStates_[key] = KeyState.NOT_PRESSED;
            }
        }
    }

    private updateInputVector_() {
        const sensitivity = 0.1;

        if (this.getPressed(KEY_UP)) {
            this.inputVector_.y = Scalar.Lerp(this.inputVector_.y, 1, sensitivity);
        } else if (this.getPressed(KEY_DOWN)) {
            this.inputVector_.y = Scalar.Lerp(this.inputVector_.y, -1, sensitivity);
        } else {
            this.inputVector_.y = 0;
        }

        if (this.getPressed(KEY_RIGHT)) {
            this.inputVector_.x = Scalar.Lerp(this.inputVector_.x, 1, sensitivity);
        } else if (this.getPressed(KEY_LEFT)) {
            this.inputVector_.x = Scalar.Lerp(this.inputVector_.x, -1, sensitivity);
        } else {
            this.inputVector_.x = 0;
        }
    }

    public getInputVector(): Vector2 {
        return this.inputVector_;
    }

    public updateTypeKeyboard(): string {

        if (this.getJustPressed("Enter")) return "Enter";
        if (this.getJustPressed("Backspace")) return "Backspace";
        if (this.getJustPressed("Space")) return "Space";

        for (const key of TYPABLE_KEYS) {
            if (this.getJustPressed(key)) {
                return this.jsKeyCodeToRealKeyStrategy_.convert(key);
            }
        }

        return "";
    }

}