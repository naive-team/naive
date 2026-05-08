import {LineUi} from "./LineUi";
import * as GUI from "@babylonjs/gui";

export class SimpleLineUi extends LineUi {
    private nextButton: GUI.Button;

    constructor(ui: GUI.AdvancedDynamicTexture) {
        super(ui);
        this.createNextButton();
        this.panel.addControl(this.nextButton);
    }

    private createNextButton(): void {
        this.nextButton = GUI.Button.CreateSimpleButton("next", "Next");
        this.nextButton.width = "80px";
        this.nextButton.height = "30px";
        this.nextButton.color = "white";
        this.nextButton.background = "gray";
        // positionner en bas à droite du panel
        this.nextButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.nextButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    }

    public onNextClicked(callback: () => void): void {
        this.nextButton.onPointerClickObservable.clear();
        this.nextButton.onPointerClickObservable.add(callback);
    }
}