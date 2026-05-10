import * as GUI from "@babylonjs/gui";

export class ChoiceUI {
    private panel: GUI.StackPanel;

    constructor(
        ui: GUI.AdvancedDynamicTexture,
        choices: string[]
    ) {
        this.createPanel(ui);

        choices.forEach((label, index) => {
            const container : GUI.Container = new GUI.Container();
            container.width = "100%";
            container.height = "100px";
            const button = GUI.Button.CreateSimpleButton(`button-${index}`, label);
            this.applyButtonDesign(button, container);
            //this.panel.addControl(button);
            this.panel.addControl(container);
        });
    }

    protected applyButtonDesign(button: GUI.Button, container: GUI.Container): void {

        button.width = "100%";
        button.height = "100px";
        button.color = "white";
        button.background = "transparent";
        button.thickness = 0;
        button.cornerRadius = 10;
        button.paddingBottom = "10px";
        button.fontFamily = "Courier New";
        button.textBlock.color = "black";
        button.textBlock.textHorizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        button.textBlock.left = "80px";

        const cursorImage = new GUI.Image("cursor", "src/data/ladybug.png");
        cursorImage.width = "70px";
        cursorImage.height = "70px";
        cursorImage.left = "-3px";
        cursorImage.top = "-5px";
        cursorImage.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        cursorImage.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        cursorImage.isVisible = false;

        const textblock = button.textBlock;
        if (textblock) {
            button.removeControl(textblock);
        }

        // Image de fond normale
        const bgImage = new GUI.Image("btnBg", "src/data/choiceButton.png");
        bgImage.width = "100%";
        bgImage.height = "100%";
        bgImage.stretch = GUI.Image.STRETCH_FILL;
        bgImage.isPointerBlocker = false; // laisser les événements passer au bouton

        // Image de fond hover
        const bgImageHover = new GUI.Image("btnBgHover", "src/data/choiceButtonHoverhover.png");
        bgImageHover.width = "100%";
        bgImageHover.height = "100%";
        bgImageHover.stretch = GUI.Image.STRETCH_FILL;
        bgImageHover.isPointerBlocker = false;
        bgImageHover.isVisible = false; // cachée par défaut

        // Ajouter les images avant le texte du bouton
        button.addControl(bgImage);
        button.addControl(bgImageHover);

        if (textblock) {
            textblock.isPointerBlocker = false;
            button.addControl(textblock);
        }

        // Gérer les événements hover
        button.onPointerEnterObservable.add(() => {
            bgImage.isVisible = false;
            bgImageHover.isVisible = true;
            textblock.fontWeight = "bold";
            textblock.color = "white";
            cursorImage.isVisible = true;
        });

        button.onPointerOutObservable.add(() => {
            bgImage.isVisible = true;
            bgImageHover.isVisible = false;
            textblock.fontWeight = "normal";
            textblock.color = "black";
            cursorImage.isVisible = false;
        });
        container.addControl(button);
        container.addControl(cursorImage);

    }

    protected createPanel(ui: GUI.AdvancedDynamicTexture): void {
        this.panel = new GUI.StackPanel();
        this.panel.width = "30%";
        this.panel.isVertical = true;
        this.panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        ui.addControl(this.panel);
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

    /**
     * Shows the panel and resolves with the index of the clicked button.
     * Cleans up all observers after a choice is made.
     */
    public waitForChoice(): Promise<number> {
        this.show();

        return new Promise((resolve) => {
            const buttons = this.panel.getDescendants() as GUI.Button[];

            const observers: Array<{ button: GUI.Button; observer: any }> = [];

            buttons.forEach((button, index) => {
                const observer = button.onPointerClickObservable.add(() => {
                    // Remove all observers to prevent stale clicks
                    observers.forEach(({ button: btn, observer: obs }) => {
                        btn.onPointerClickObservable.remove(obs);
                    });

                    this.hide();
                    resolve(index);
                });

                observers.push({ button, observer });
            });
        });
    }
}