// CustomLoadingScreen.ts
import { ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {
    loadingUIText: string = "";
    loadingUIBackgroundColor: string = "#000000";

    private container_: HTMLDivElement | null = null;

    constructor(private canvas_: HTMLCanvasElement) {}

    displayLoadingUI(): void {
        if (this.container_) return; // déjà affiché

        this.container_ = document.createElement("div");
        this.container_.style.cssText = `
            position: absolute;
            top: ${this.canvas_.offsetTop}px;
            left: ${this.canvas_.offsetLeft}px;
            width: ${this.canvas_.width}px;
            height: ${this.canvas_.height}px;
            background: url('/background ladybug.png') center/cover no-repeat;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        // Ton logo
        const logo = document.createElement("img");
        logo.src = "/background ladybug.png";
        logo.style.cssText = `width: 200px; margin-bottom: 30px;`;

        // Texte de chargement
        const text = document.createElement("p");
        text.innerText = this.loadingUIText || "Chargement...";
        text.style.cssText = `color: white; font-size: 18px; font-family: sans-serif;`;

        this.container_.appendChild(logo);
        this.container_.appendChild(text);
        document.body.appendChild(this.container_);
    }

    hideLoadingUI(): void {
        if (!this.container_) return;

        // Fade out optionnel
        this.container_.style.transition = "opacity 0.5s ease";
        this.container_.style.opacity = "0";
        setTimeout(() => {
            this.container_?.remove();
            this.container_ = null;
        }, 500);
    }
}