import {Scene} from "@babylonjs/core";
import {TextBlock} from "@babylonjs/gui";

export function typewriterEffect(
    scene: Scene,
    textBlock: TextBlock,
    fullText: string,
    delayMs: number = 15,
    onComplete?: () => void
): { cancel: () => void; isComplete: () => boolean } {
    let currentIndex = 0;
    let cancelled = false;
    let completed = false;
    let lastTime = 0;

    textBlock.text = "";

    const observer = scene.onBeforeRenderObservable.add(() => {
        if (cancelled) return;

        const now = performance.now();

        if (now - lastTime >= delayMs) {
            lastTime = now;

            if (currentIndex < fullText.length) {
                textBlock.text += fullText[currentIndex];
                currentIndex++;
            } else {
                completed = true;
                scene.onBeforeRenderObservable.remove(observer);
                onComplete?.();
            }
        }
    });

    return {
        cancel: () => {
            cancelled = true;
            scene.onBeforeRenderObservable.remove(observer);
        },
        isComplete: () => completed,
    };
}