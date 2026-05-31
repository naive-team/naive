import * as GUI from "@babylonjs/gui";
import {Scene} from "@babylonjs/core";
import {typewriterEffect} from "../util/typewriterEffect";

export class LineUi {
    protected panel:GUI.Container;
    private textBlock: GUI.TextBlock;
    private nameBlock: GUI.TextBlock;
    private animHandle: { cancel: () => void; isComplete: () => boolean } | null = null;

    constructor(
        ui: GUI.AdvancedDynamicTexture,
    ) {
        this.createPanel();
        this.createNamePanel()
        this.createTextBlock();
        this.createIndicator();
        ui.addControl(this.panel);

    }
    public skipAnimation(fullText: string): boolean {
        if (!this.animHandle){
            console.log("anim handle est pas def");
        }
        if (this.animHandle && !this.animHandle.isComplete()) {
            this.animHandle.cancel();
            this.animHandle = null;
            this.textBlock.text = fullText; // affiche tout le texte immédiatement
            return true;
        }
        return false;
    }

    public setSpeakerName(name: string): void {
        if (this.nameBlock){
            this.nameBlock.text = name;
        }

    }
    public animation(scene:Scene, text: string): void {
        this.animHandle = typewriterEffect(scene, this.textBlock, text);

    }
    protected createNamePanel(): void {

        this.nameBlock = new GUI.TextBlock();
        this.nameBlock.color = "white";
        this.nameBlock.fontSize = 24;
        this.nameBlock.fontFamily = "Courier New";
        this.nameBlock.fontStyle = "bold";

        const container = new GUI.Container();
        container.width = "15%";
        container.height = "25%";
        container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        container.adaptHeightToChildren = true;
        container.adaptWidthToChildren = true;
        container.left = "24%";
        container.top = "4%";

        const bg = new GUI.Image("bg", "src/data/bg_speaker.png");
        bg.width = "222px";
        bg.height = "92px";
        bg.stretch = GUI.Image.STRETCH_FILL;
        container.addControl(bg);
        container.addControl(this.nameBlock);

        this.panel.addControl(container);
    }
    protected createPanel(): void {

        const container = new GUI.Container();
        container.width = "100%";
        container.height = "35%";
        container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        container.top = "-5%";
        container.clipChildren = false;

        const bg = new GUI.Image("bg", "src/data/bg_dialog.png");
        bg.width = "100%";
        bg.height = "100%";
        bg.stretch = GUI.Image.STRETCH_FILL;

        container.addControl(bg);
        this.panel = container;
    }
    protected createTextBlock(): void {
        const container = new GUI.Container();
        container.width = "100%";
        container.height = "35%";
        container.paddingBottom = "2%";
        container.paddingLeft = "25%";
        container.paddingRight = "25%";
        container.paddingTop = "2%";
        container.top = "2%";

        this.textBlock = new GUI.TextBlock();
        this.textBlock.color = "black";
        this.textBlock.fontSize = 30;
        this.textBlock.fontFamily = "Courier New";
        this.textBlock.textWrapping = true;
        this.textBlock.textHorizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        container.addControl(this.textBlock);
        this.panel.addControl(container);
    }

    public show(): void {
        this.panel.isVisible = true;
    }

    public hide(): void {
        this.panel.isVisible = false;
    }

    public dispose(): void {
        this.panel.dispose();
    }

    private createIndicator() {
        let textBlock = new GUI.TextBlock();
        textBlock.color = "white";
        textBlock.fontSize = 15;
        textBlock.fontFamily = "Courier New";
        textBlock.textWrapping = true;
        textBlock.textHorizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
        textBlock.horizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
        textBlock.text = "Clique pour continuer";
        textBlock.paddingBottom = "-70%";
        textBlock.paddingRight = "5%";
        this.panel.addControl(textBlock);
    }
}