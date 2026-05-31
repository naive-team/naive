import {InputStrategy} from "./InputStrategy";
import {Scalar} from "@babylonjs/core";
import {Button} from "../Button";
import { AbstractInput } from "../AbstractInput";
import { InputMappers } from "../InputMappers";
import {Printer} from "../../../util/Printer/Printer";
import {PrinterTag} from "../../../util/Printer/PrinterTag";


export class KeyboardMouseInput extends AbstractInput implements InputStrategy {
    private readonly keydownHandler_: (e: KeyboardEvent) => void;
    private readonly keyupHandler_: (e: KeyboardEvent) => void;
    private readonly mouseEventHandler_: (e: MouseEvent) => void;

    private readonly mouseSensitivity_: number = 1;
    private mouseX_: number = 0;
    private mouseY_: number = 0;
    private previousMouseX_: number = 0;
    private previousMouseY_: number = 0; 
    private latestMouseEvent: MouseEvent;
    

    constructor() {
        super();

        this.keydownHandler_ = (e) => {
            const button: Button = InputMappers.KeyCodeToButton(e.code);
            this.inputMap_[button] = true;

            Printer.print(PrinterTag.INPUT, `Button down : ${button}`);
        };

        this.keyupHandler_ = (e) => {
            const button: Button = InputMappers.KeyCodeToButton(e.code);
            this.inputMap_[button] = false;
        }

        this.mouseEventHandler_ = (e: MouseEvent) => {
            this.latestMouseEvent = e;
        }
    }

    startListening(): void {
        window.addEventListener("keydown", this.keydownHandler_);
        window.addEventListener("keyup", this.keyupHandler_);
        window.addEventListener('mousemove', this.mouseEventHandler_);
    }

    stopListening(): void {
        window.removeEventListener("keydown", this.keydownHandler_);
        window.removeEventListener("keyup", this.keyupHandler_);
        window.removeEventListener("mousemove", this.mouseEventHandler_);
    }

    update(): void {
        if (this.buttonPressed(Button.LEFT)) {
            this.leftHorizontal_ = Scalar.Lerp(this.leftHorizontal_, -1, 0.2);
            Printer.print(PrinterTag.INPUT, "Left pressed", this.leftHorizontal_);
        }
        if (this.buttonPressed(Button.RIGHT)) {
            this.leftHorizontal_ = Scalar.Lerp(this.leftHorizontal_, 1, 0.2);
            Printer.print(PrinterTag.INPUT, "Right pressed", this.leftHorizontal_);
        }
        if (this.buttonPressed(Button.UP)) {
            this.leftHorizontal_ = Scalar.Lerp(this.leftHorizontal_, 1, 0.2);
            Printer.print(PrinterTag.INPUT, "Up pressed", this.leftHorizontal_);
        }
        if (this.buttonPressed(Button.DOWN)) {
            this.leftHorizontal_ = Scalar.Lerp(this.leftHorizontal_, -1, 0.2);
            Printer.print(PrinterTag.INPUT, "Down pressed", this.leftHorizontal_);
        }

        this.updateMouse_();

        Printer.print(PrinterTag.INPUT, this.rightHorizontal_, this.rightVertical_);
    }

    private updateMouse_(): void {
        this.updateMousePos_();

        const deltaX: number = this.mouseX_ - this.previousMouseX_;
        const deltaY: number = this.mouseY_ - this.previousMouseY_;

        const sensibilityX = deltaX * this.mouseSensitivity_;
        const sensibilityY = deltaY * this.mouseSensitivity_;

        this.rightHorizontal_ = clamp(sensibilityX, -1, 1);
        this.rightVertical_ = clamp(sensibilityY, -1, 1);
    }

    private updateMousePos_(): void {
        this.previousMouseX_ = this.mouseX_;
        this.previousMouseY_ = this.mouseY_;
        
        if (! this.latestMouseEvent) return;

        this.mouseX_ = this.latestMouseEvent.clientX;
        this.mouseY_ = this.latestMouseEvent.clientY;
    }
}

function clamp(sensibilityX: number, lower: number, upper: number): number {
    return Math.min(Math.max(sensibilityX, lower), upper);
}
