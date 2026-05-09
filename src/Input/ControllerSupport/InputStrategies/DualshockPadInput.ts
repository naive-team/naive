import { InputStrategy } from "./InputStrategy";
import { DualShockPad } from "@babylonjs/core";
import { AbstractInput } from "../AbstractInput";
import { InputMappers } from "../InputMappers";
import { InputListeners } from "../InputListeners";

export class DualshockPadInput extends AbstractInput implements InputStrategy {
    private gamepad_: DualShockPad;

    constructor(gamepad: DualShockPad) {
        super();
        this.gamepad_ = gamepad;
    }

    update(): void {

    }

    startListening(): void {
        InputListeners.startListeningGamepad(this.gamepad_, InputMappers.dualshockToButton, this.inputMap_, this.onLeftStickChanged, this.onRightStickChanged);
    }

    stopListening(): void {
        InputListeners.stopListeningGamepad(this.gamepad_);
    }
}