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
            gap: 20px;
            z-index: 9999;
        `;

        // Injection des keyframes CSS
        const style = document.createElement("style");
        style.textContent = `
            @keyframes ladybug-spin {
                0%   { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes ladybug-pulse {
                0%, 100% { transform: scale(1);   opacity: 1;   }
                50%       { transform: scale(1.15); opacity: 0.7; }
            }
            .lb-spinner {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                border: 5px solid rgba(255, 255, 255, 0.25);
                border-top-color: #e63946;
                border-right-color: #e63946;
                animation: ladybug-spin 0.9s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
            }
            .lb-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #e63946;
                animation: ladybug-pulse 1.4s ease-in-out infinite;
            }
            .lb-dots {
                display: flex;
                gap: 8px;
            }
            .lb-dots .lb-dot:nth-child(2) { animation-delay: 0.2s; }
            .lb-dots .lb-dot:nth-child(3) { animation-delay: 0.4s; }
        `;
        document.head.appendChild(style);

        // Spinner circulaire
        const spinner = document.createElement("div");
        spinner.className = "lb-spinner";

        // Texte de chargement
        const text = document.createElement("p");
        text.innerText = this.loadingUIText || "Chargement...";
        text.style.cssText = `
            color: white;
            font-size: 24px;
            font-family: courier new;
            font-weight: bold;
            margin: 0;
            letter-spacing: 0.05em;
            text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        `;

        this.container_.appendChild(spinner);
        this.container_.appendChild(text);
        document.body.appendChild(this.container_);
    }

    hideLoadingUI(): void {
        if (!this.container_) return;

        this.container_.style.transition = "opacity 0.5s ease";
        this.container_.style.opacity = "0";
        setTimeout(() => {
            this.container_?.remove();
            this.container_ = null;
        }, 500);
    }
}