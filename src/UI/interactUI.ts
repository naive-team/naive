import { AdvancedDynamicTexture, Rectangle, TextBlock, StackPanel } from "@babylonjs/gui";

export class InteractUI {
    interactionName: string;
    private advancedTexture: AdvancedDynamicTexture;
    private container: StackPanel;

    constructor(interactionName: string) {
        this.interactionName = interactionName;
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("InteractUI");
        this.container = this.createUI();
    }

    private createUI(): StackPanel {
        const panel = new StackPanel("interactPanel");
        panel.isVertical = false;
        panel.horizontalAlignment = StackPanel.HORIZONTAL_ALIGNMENT_CENTER;
        panel.verticalAlignment = StackPanel.VERTICAL_ALIGNMENT_BOTTOM;
        panel.top = "-40px";
        panel.height = "44px";
        panel.adaptWidthToChildren = true;
        panel.isVisible = false;

        // --- Icône [F] ---
        const keyBox = new Rectangle("keyBox");
        keyBox.width = "28px";
        keyBox.height = "28px";
        keyBox.cornerRadius = 5;
        keyBox.color = "transparent";
        keyBox.background = "white";
        keyBox.paddingRight = "10px";

        const keyLabel = new TextBlock("keyLabel", "F");
        keyLabel.color = "black";
        keyLabel.fontSize = 14;
        keyLabel.fontWeight = "bold";
        keyBox.addControl(keyLabel);

        // --- Nom de l'interaction ---
        const nameLabel = new TextBlock("nameLabel", this.interactionName);
        nameLabel.color = "white";
        nameLabel.fontSize = 16;
        nameLabel.resizeToFit = true;

        panel.addControl(keyBox);
        panel.addControl(nameLabel);
        this.advancedTexture.addControl(panel);

        return panel;
    }

    show(): void {
        this.container.isVisible = true;
    }

    hide(): void {
        this.container.isVisible = false;
    }

    dispose(): void {
        this.advancedTexture.dispose();
    }
}