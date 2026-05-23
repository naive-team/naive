import { DualShockButton, DualShockDpad, Xbox360Button, Xbox360Dpad} from "@babylonjs/core";
import { Button } from "./Button";

enum KeyCode {
    KeyW = "KeyW",
    KeyA = "KeyA",
    KeyS = "KeyS",
    KeyD = "KeyD",
    ShiftLeft = "ShiftLeft",
    Space = "Space",
    Enter = "Enter"
}

export class InputMappers {

    private static readonly keyCodeToButton_ : Record<KeyCode, Button> = {
        [KeyCode.KeyW]: Button.UP,
        [KeyCode.KeyA]: Button.LEFT,
        [KeyCode.KeyS]: Button.DOWN,
        [KeyCode.KeyD]: Button.RIGHT,
        [KeyCode.ShiftLeft]: Button.CANCEL,
        [KeyCode.Space]: Button.ACTION,
        [KeyCode.Enter]: Button.START
    }

    private static readonly dualshockToButton_: Record<number, Button> = {
        [DualShockButton.Cross]: Button.ACTION,
        [DualShockButton.Circle]: Button.CANCEL,
        [DualShockButton.Options]: Button.START,
        [DualShockDpad.Down]: Button.DOWN,
        [DualShockDpad.Up]: Button.UP,
        [DualShockDpad.Right]: Button.RIGHT,
        [DualShockDpad.Left]: Button.LEFT
    }

    private static readonly xbox360ToButton_: Record<number, Button> = {
        [Xbox360Button.A]: Button.ACTION,
        [Xbox360Button.B]: Button.CANCEL,
        [Xbox360Button.Start]: Button.START,
        [Xbox360Dpad.Down]: Button.DOWN,
        [Xbox360Dpad.Up]: Button.UP,
        [Xbox360Dpad.Right]: Button.RIGHT,
        [Xbox360Dpad.Left]: Button.LEFT 
    }

    private static readonly genericToButton_: Record<number, Button> = {
        1: Button.ACTION,
        0: Button.CANCEL,
        9: Button.START,
        13: Button.DOWN,
        12: Button.UP,
        15: Button.RIGHT,
        14: Button.LEFT
    }

    static KeyCodeToButton(keyCode: string): Button {
        return InputMappers.keyCodeToButton_[keyCode];
    }

    static genericNumberToButton(n: number): Button {
        const button: Button = InputMappers.genericToButton_[n];
        return button;
    }

    static dualshockToButton(n: number) {
        return InputMappers.dualshockToButton_[n];
    }

    static xbox360ToButton(n: number) {
        return InputMappers.xbox360ToButton_[n];
    }
}

