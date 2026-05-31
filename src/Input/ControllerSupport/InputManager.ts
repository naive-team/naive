import {InputStrategy} from "./InputStrategies/InputStrategy";
import {KeyboardMouseInput} from "./InputStrategies/KeyboardMouseInput";
import {GenericGamepadInput} from "./InputStrategies/GenericGamepadInput";
import {GamepadManager, GenericPad, Xbox360Pad, DualShockPad} from '@babylonjs/core';
import { Xbox360Input } from "./InputStrategies/Xbox360PadInput";
import { DualshockPadInput } from "./InputStrategies/DualshockPadInput";
import {PrinterTag} from "../../util/Printer/PrinterTag";
import {Printer} from "../../util/Printer/Printer";

export class InputManager {
    private currentInput_: InputStrategy;

    constructor() {
        this.currentInput_ = new KeyboardMouseInput();
        this.currentInput_.startListening();

        const gamepadManager = new GamepadManager();

        gamepadManager.onGamepadConnectedObservable.add((gamepad) => {
            if (gamepad instanceof GenericPad) {
                Printer.print(PrinterTag.INPUT, "GenericPad connected !");
                this.changeInput_(new GenericGamepadInput(gamepad));
            }
            else if (gamepad instanceof Xbox360Pad) {
                Printer.print(PrinterTag.INPUT, "Xbox360Pad connected !");
                this.changeInput_(new Xbox360Input(gamepad));
            }
            else if (gamepad instanceof DualShockPad) {
                Printer.print(PrinterTag.INPUT, "DualshockPad connected !");
                this.changeInput_(new DualshockPadInput(gamepad));
            }
        });

        gamepadManager.onGamepadDisconnectedObservable.add(() => {
            this.changeInput_(new KeyboardMouseInput());
        })
    }

    private changeInput_(newInput: InputStrategy) {
        if (this.currentInput_) this.currentInput_.stopListening();
        this.currentInput_ = newInput;
        this.currentInput_.startListening();

        Printer.print(PrinterTag.INPUT, "Input changed to :", newInput);
    }

    public update(): void {
        if (! this.currentInput_) return;

        this.currentInput_.update();
    }

    public getCurrentInput(): InputStrategy {
        return this.currentInput_;
    }
}