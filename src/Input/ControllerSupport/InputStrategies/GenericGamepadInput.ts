import {InputStrategy} from "./InputStrategy";
import {GenericPad} from "@babylonjs/core";
import {Printer} from "../../util/Printer/Printer";
import { AbstractInput } from "../AbstractInput";
import { InputMappers } from "../InputMappers";
import { InputListeners } from "../InputListeners";
import { PrinterTag } from "../../util/Printer/PrinterTag";


export class GenericGamepadInput extends AbstractInput implements InputStrategy {
    private gamepad_: GenericPad;

    constructor(gamepad: GenericPad) {
        super();
        this.gamepad_ = gamepad;
    }

    update(): void {

    }

    startListening(): void {
        Printer.print(PrinterTag.INPUT, "Attaching generic gamepad observables");
        InputListeners.startListeningGamepad(this.gamepad_, InputMappers.genericNumberToButton, this.inputMap_, this.onLeftStickChanged, this.onRightStickChanged);
    }

    stopListening(): void {
        InputListeners.stopListeningGamepad(this.gamepad_);
    }
}