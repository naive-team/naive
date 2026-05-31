import { Button } from "../Button";

export interface InputStrategy {
    getLeftHorizontal(): number;
    getLeftVertical(): number;
    getRightHorizontal(): number;
    getRightVertical(): number;

    buttonPressed(button: Button): boolean;

    update(): void;

    startListening(): void;
    stopListening(): void;
}