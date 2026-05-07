import * as GUI from "@babylonjs/gui";

export class LineUi {
    protected panel: GUI.Rectangle;
    private textBlock: GUI.TextBlock;

    constructor(
        ui: GUI.AdvancedDynamicTexture,
    ) {
        this.createPanel();

        // Création du texte
        this.createTextBlock();

        // Ajout du texte dans le panel
        this.panel.addControl(this.textBlock);

        // Ajout du panel dans l'UI
        ui.addControl(this.panel);
    }

    public setText(text: string): void {
        this.textBlock.text = text;
    }
    protected createPanel(): void {
        this.panel = new GUI.Rectangle();

        this.panel.width = 300;
        this.panel.height = 100;
        this.panel.cornerRadius = 20;
        this.panel.color = "white";
        this.panel.thickness = 2;
        this.panel.background = "black"; // todo remplacer par une image
    }
    protected createTextBlock(): void {
        this.textBlock = new GUI.TextBlock();
        //TODO remplqcer style
        this.textBlock.color = "white";
        this.textBlock.fontSize = 24;
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