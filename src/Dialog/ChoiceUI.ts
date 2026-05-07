import * as GUI from "@babylonjs/gui";

export class ChoiceUI {
    private panel: GUI.StackPanel;

    constructor(
        ui: GUI.AdvancedDynamicTexture,
        items: string[],
        onClick: (index: number) => void
    ) {
        this.panel = new GUI.StackPanel();

        this.panel.width = "220px";
        this.panel.isVertical = true;
        this.panel.horizontalAlignment =
            GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

        this.panel.verticalAlignment =
            GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        ui.addControl(this.panel);

        items.forEach((label, index) => {
            const button = GUI.Button.CreateSimpleButton(
                `button-${index}`,
                label
            );

            button.width = "200px";
            button.height = "50px";
            button.color = "white";
            button.background = "black";
            button.thickness = 1;
            button.cornerRadius = 10;

            button.paddingBottom = "10px";

            // Retourne l'index du bouton cliqué
            button.onPointerClickObservable.add(() => {
                onClick(index);
            });

            this.panel.addControl(button);
        });
    }

    public dispose(): void {
        this.panel.dispose();
    }
}