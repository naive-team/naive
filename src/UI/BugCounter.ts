import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import {Scene} from "@babylonjs/core";
import {AdvancedDynamicTexture, Image} from "@babylonjs/gui";

/**
 * LogoCounterUI — Babylon.js GUI overlay
 * Affiche un logo SVG/texte + un compteur interactif en HUD
 */
export class BugCounter {
    private _advancedTexture: GUI.AdvancedDynamicTexture;
    private _counterValue: number = 0;
    private _counterText!: GUI.TextBlock;
    private  imageUrl_ : string;
    private hudPanel:GUI.StackPanel;

    constructor(imageUrl_ : string = "./ladybug center.png") {
        this._advancedTexture =
            AdvancedDynamicTexture.CreateFullscreenUI("LogoCounterUI");
        this.imageUrl_ = imageUrl_;
        this._buildUI();
        this.hide();
    }

    // ─── Construction de l'interface ────────────────────────────────────────────

    private _buildUI(): void {
        const hudPanel = new GUI.StackPanel("hudPanel");
        hudPanel.isVertical = false;
        hudPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        hudPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        hudPanel.left = "20px";
        hudPanel.top = "20px";
        hudPanel.width = "320px";
        hudPanel.height = "80px";
        hudPanel.paddingLeft = "12px";
        hudPanel.paddingRight = "12px";
        this.hudPanel = hudPanel;
        this._advancedTexture.addControl(hudPanel);

        // Fond semi-transparent derrière le HUD
        /*const background = new GUI.Rectangle("hudBg");
        background.width = "320px";
        background.height = "80px";
        background.cornerRadius = 16;
        background.color = "rgba(255,255,255,0.12)";
        background.background = "rgba(10, 10, 30, 0.72)";
        background.thickness = 1;
        background.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        background.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        background.left = "20px";
        background.top = "20px";
        this._advancedTexture.addControl(background);*/

        // ── Logo ──────────────────────────────────────────────────────────────────

        const logoContainer = new GUI.StackPanel("logoContainer");
        logoContainer.isVertical = true;
        logoContainer.width = "140px";
        logoContainer.height = "64px";
        logoContainer.paddingRight = "-35px";
        hudPanel.addControl(logoContainer);

        const logoIcon = new Image("activezSon", this.imageUrl_);
        logoIcon.width = "100%";
        logoIcon.height = "100%";
        logoContainer.addControl(logoIcon);

        // ── Compteur ──────────────────────────────────────────────────────────────

        const counterContainer = new GUI.StackPanel("counterContainer");
        counterContainer.isVertical = false;
        counterContainer.width = "140px";
        counterContainer.height = "64px";
        hudPanel.addControl(counterContainer);

        const multSymbol = new GUI.TextBlock("x", "x");
        multSymbol.color = "#FFFFFF";
        multSymbol.fontSize = 26;
        multSymbol.fontFamily = "'Press Start 2P'";
        multSymbol.width = "30px";
        counterContainer.addControl(multSymbol);

        // Valeur du compteur
        this._counterText = new GUI.TextBlock("counterValue", "0");
        this._counterText.color = "#FFFFFF";
        this._counterText.fontSize = 26;
        this._counterText.fontFamily = "'Press Start 2P'";
        this._counterText.fontStyle = "bold";
        this._counterText.width = "30px";
        counterContainer.addControl(this._counterText);
    }

    // ─── API publique ────────────────────────────────────────────────────────────

    public increment(delta: number = 1): void {
        this._counterValue += delta;
        this._counterText.text = this._counterValue.toString();
        this._refresh();
    }

    public reset(): void {
        this._counterValue = 0;
        this._counterText.text = this._counterValue.toString();

        this._refresh();
    }

    public setValue(value: number): void {
        this._counterValue = value;
        this._counterText.text = this._counterValue.toString();

        this._refresh();
    }

    public get value(): number {
        return this._counterValue;
    }

    public show(){
        this.hudPanel.isVisible = true;
    }
    public hide(){
        this.hudPanel.isVisible = false;
    }

    private _refresh(): void {
        console.log("counter vzlue = ", this._counterValue);
        // Flash rapide pour feedback visuel
        this._counterText.color = "#7DF9FF";
        setTimeout(() => {
            if (this._counterText) this._counterText.color = "#FFFFFF";
        }, 120);
        if (this._counterText.text =="0"){
            console.log("counter text = ", this._counterText.text);
            console.log("== 0 so on cache")
            this.hide();
        }
        else {
            console.log("shox ui counter")
            this.show();
        }
    }

    public dispose(): void {
        this._advancedTexture.dispose();
    }
}
