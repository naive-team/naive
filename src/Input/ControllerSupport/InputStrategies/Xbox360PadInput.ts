import { Xbox360Pad } from "@babylonjs/core";
import { AbstractInput } from "../AbstractInput";
import { InputListeners } from "../InputListeners";
import { InputMappers } from "../InputMappers";
import { InputStrategy } from "./InputStrategy";

export class Xbox360Input extends AbstractInput implements InputStrategy {
    private gamepad_: Xbox360Pad;

    constructor(gamepad: Xbox360Pad) {
        super();
        this.gamepad_ = gamepad;
    }

    update(): void {

    }

    startListening(): void {
        InputListeners.startListeningGamepad(this.gamepad_, InputMappers.xbox360ToButton, this.inputMap_, this.onLeftStickChanged, this.onRightStickChanged);        
    }

    stopListening(): void {
        InputListeners.stopListeningGamepad(this.gamepad_);
    }
}