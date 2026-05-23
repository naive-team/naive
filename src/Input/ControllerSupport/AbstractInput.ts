import { Button } from "./Button";
import  { InputStrategy } from "./InputStrategies/InputStrategy";
import {Printer} from "../../util/Printer/Printer";
import {PrinterTag} from "../../util/Printer/PrinterTag";

export abstract class AbstractInput implements InputStrategy {
    protected leftHorizontal_: number;
    protected leftVertical_: number;
    protected rightHorizontal_: number;
    protected rightVertical_: number;

    protected onLeftStickChanged: (values: any) => void = (values) => {
        this.leftHorizontal_ = values.x;
        this.leftVertical_ = values.y;

        Printer.print(PrinterTag.INPUT, this.leftHorizontal_, this.leftVertical_);
    };

    protected onRightStickChanged: (values: any) => void = (values) => {
        this.rightHorizontal_ = values.x;
        this.rightVertical_ = values.y;

        Printer.print(PrinterTag.INPUT, this.rightHorizontal_, this.rightVertical_);
    };

    protected inputMap_: Record<Button, boolean> = {
        [Button.ACTION]: false,
        [Button.CANCEL]: false,
        [Button.START]: false,
        [Button.DOWN]: false,
        [Button.UP]: false,
        [Button.RIGHT]: false,
        [Button.LEFT]: false
    };

    buttonPressed(button: Button): boolean {
        return this.inputMap_[button];
    }
    
    getLeftHorizontal(): number {
        return this.leftHorizontal_;
    }

    getRightHorizontal(): number {
        return this.rightHorizontal_;
    }

    getLeftVertical(): number {
        return this.leftVertical_;
    }

    getRightVertical(): number {
        return this.rightVertical_;
    }

    abstract startListening(): void;
    abstract stopListening(): void;
    abstract update(): void;
}
