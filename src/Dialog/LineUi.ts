import * as GUI from "@babylonjs/gui";

export class LineUi {
    private panel: GUI.Rectangle;
    private textBlock: GUI.TextBlock;

    constructor(
        ui: GUI.AdvancedDynamicTexture,
        text: string,
        width: string = "300px",
        height: string = "100px"
    ) {
        // Création du panel
        this.panel = new GUI.Rectangle();

        this.panel.width = width;
        this.panel.height = height;
        this.panel.cornerRadius = 20;
        this.panel.color = "white";
        this.panel.thickness = 2;
        this.panel.background = "black";

        // Création du texte
        this.textBlock = new GUI.TextBlock();

        this.textBlock.text = text;
        this.textBlock.color = "white";
        this.textBlock.fontSize = 24;

        // Ajout du texte dans le panel
        this.panel.addControl(this.textBlock);

        // Ajout du panel dans l'UI
        ui.addControl(this.panel);
    }

    public setText(text: string): void {
        this.textBlock.text = text;
    }

    public setPosition(top: string, left: string): void {
        this.panel.top = top;
        this.panel.left = left;
    }

    public setBackground(color: string): void {
        this.panel.background = color;
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
}