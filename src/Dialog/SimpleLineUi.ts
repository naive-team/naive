import {LineUi} from "./LineUi";
import * as GUI from "@babylonjs/gui";

export class SimpleLineUi {
    private nextButton: GUI.Button;

    constructor(ui: GUI.AdvancedDynamicTexture) {
        this.createNextButton();
        ui.addControl(this.nextButton);
    }
    public show(): void {
        this.nextButton.isVisible = true;
    }
    public hide(): void {
        this.nextButton.isVisible = false;
    }
    private createNextButton(): void {
        // suffit de cliquer nimporte ou pour avancer dans dialogue
        this.nextButton = GUI.Button.CreateSimpleButton("Next", "");
        this.nextButton.width = "100%";
        this.nextButton.height = "100%";
        this.nextButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.nextButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.nextButton.pointerDownAnimation = null;
    }

    public onNextClicked(callback: () => void): void {
        this.nextButton.onPointerClickObservable.clear();
        this.nextButton.onPointerClickObservable.add(callback);
    }
}