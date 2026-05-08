import {Vector2, Scalar} from "@babylonjs/core";
import {KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_UP} from "./Keys";

type JsKeyCode = KeyboardEvent["code"];

export class Input {
    private readonly keyPressed_: Record<JsKeyCode, boolean>
    private inputVector_: Vector2 = new Vector2(0, 0);

    constructor() {
        this.keyPressed_ = {};

        window.addEventListener("keydown", (key) =>  {
            this.keyPressed_[key.code] = true;
        });

        window.addEventListener("keyup", (key) => {
            this.keyPressed_[key.code] = false;
        });
    }

    public getPressed(jsKeyCode: JsKeyCode): boolean {
        const result = this.keyPressed_[jsKeyCode];

        if (result === undefined) return false;

        return result;
    }

    public update(): void {
        const sensitivity = 0.1;

        if (this.getPressed(KEY_UP)) {
            this.inputVector_.y = Scalar.Lerp(this.inputVector_.y, 1, sensitivity);
        }
        else if (this.getPressed(KEY_DOWN)) {
            this.inputVector_.y = Scalar.Lerp(this.inputVector_.y, -1, sensitivity);
        }
        else {
            this.inputVector_.y = 0;
        }


        if (this.getPressed(KEY_RIGHT)) {
            this.inputVector_.x = Scalar.Lerp(this.inputVector_.x, 1, sensitivity);
        }
        else if (this.getPressed(KEY_LEFT)) {
            this.inputVector_.x = Scalar.Lerp(this.inputVector_.x, -1, sensitivity);
        }
        else {
            this.inputVector_.x = 0;
        }
    }

    public getInputVector(): Vector2 {
        return this.inputVector_;
    }

}