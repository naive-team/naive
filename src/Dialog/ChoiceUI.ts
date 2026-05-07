import * as GUI from "@babylonjs/gui";

export class ChoiceUI {
    private panel: GUI.StackPanel;

    constructor(
        ui: GUI.AdvancedDynamicTexture,
        choices: string[]
    ) {
        this.createPanel(ui);

        choices.forEach((label, index) => {
            const button = GUI.Button.CreateSimpleButton(`button-${index}`, label);
            this.applyButtonDesign(button);
            this.panel.addControl(button);
        });
    }

    protected applyButtonDesign(button: GUI.Button): void {
        button.width = "200px";
        button.height = "50px";
        button.color = "white";
        button.background = "black";
        button.thickness = 1;
        button.cornerRadius = 10;
        button.paddingBottom = "10px";
    }

    protected createPanel(ui: GUI.AdvancedDynamicTexture): void {
        this.panel = new GUI.StackPanel();
        this.panel.width = "220px";
        this.panel.isVertical = true;
        this.panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
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