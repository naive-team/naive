import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

// ─────────────────────────────────────────────
// MatrixTextureEffect
// Remplace la texture d'un mesh importé par un
// effet "Matrix" (binaire vert animé) via un
// canvas 2D mis à jour chaque frame.
// ─────────────────────────────────────────────

export type TextureSlot =
    | "diffuse"     // StandardMaterial.diffuseTexture  / PBRMaterial.albedoTexture
    | "albedo"      // PBRMaterial.albedoTexture (alias PBR)
    | "emissive"    // .emissiveTexture
    | "ambient"     // .ambientTexture
    | "specular"    // StandardMaterial.specularTexture
    | "bump"        // .bumpTexture (normal map)
    | "metallic"    // PBRMaterial.metallicTexture
    | "opacity"     // .opacityTexture
    | "reflection"; // StandardMaterial.reflectionTexture

// Texture seule, par slot
interface SlotState {
    texture: BABYLON.Nullable<BABYLON.BaseTexture>;
}

// Propriétés du matériau (partagées entre tous les slots)
interface MatState {
    emissiveColor:   BABYLON.Color3;
    disableLighting?: boolean;
    unlit?:           boolean;
}

export class MatrixTextureEffect {

    // ── Propriétés privées ───────────────────────
    private readonly scene:        BABYLON.Scene;
    private readonly matrixCanvas: HTMLCanvasElement;
    private readonly matrixCtx:    CanvasRenderingContext2D;
    private readonly dynTexture:   BABYLON.DynamicTexture;
    private readonly material:     BABYLON.StandardMaterial;

    // Clé : `${mat.uniqueId}_${slot}` → texture d'origine du slot
    private readonly slotStates = new Map<string, SlotState>();
    // Clé : mat.uniqueId → props d'origine du matériau (sauvegardées une seule fois)
    private readonly matStates  = new Map<number, MatState>();

    private readonly canvasSize: number = 512;
    private readonly fontSize:   number = 14;
    private readonly cols:       number;
    private readonly drops:      number[];

    // Couleurs Matrix — personnalisables
    private charColor: string = "#00FF41";
    private headColor: string = "#AFFFBC";
    private fadeColor: string = "rgba(0,0,0,0.05)";

    // ── Constructeur ─────────────────────────────
    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        this.cols  = Math.floor(this.canvasSize / this.fontSize);
        this.drops = Array(this.cols).fill(1);

        // 1. Canvas 2D hors DOM
        this.matrixCanvas        = document.createElement("canvas");
        this.matrixCanvas.width  = this.canvasSize;
        this.matrixCanvas.height = this.canvasSize;
        const ctx = this.matrixCanvas.getContext("2d");
        if (!ctx) throw new Error("Impossible de créer le contexte 2D canvas.");
        this.matrixCtx = ctx;

        // 2. DynamicTexture Babylon.js
        this.dynTexture = new BABYLON.DynamicTexture(
            "matrixDynTex",
            { width: this.canvasSize, height: this.canvasSize },
            this.scene,
            false,
        );

        // 3. Matériau Standard interne (non utilisé sur les meshes cibles)
        this.material = new BABYLON.StandardMaterial("matrixMat", this.scene);
        this.material.diffuseTexture  = this.dynTexture;
        this.material.emissiveColor   = new BABYLON.Color3(0, 0.85, 0.2);
        this.material.disableLighting = true;

        // 4. Boucle de rendu
        this.scene.registerBeforeRender(() => this.update());
    }

    // ── API publique ─────────────────────────────

    public getDynTexture(): BABYLON.DynamicTexture {
        return this.dynTexture;
    }

    /**
     * Remplace UNE seule texture (slot) sur un StandardMaterial ou PBRMaterial,
     * sans toucher aux autres slots ni aux autres matériaux du mesh.
     */
    public applyToTextureSlot(
        mesh:     BABYLON.AbstractMesh,
        slot:     TextureSlot = "diffuse",
        matName?: string
    ): void {
        const target = this.findMeshWithMaterial(mesh, matName);
        if (!target) {
            console.warn(`[MatrixEffect] Aucun matériau "${matName ?? "(quelconque)"}" trouvé sur "${mesh.name}" ni ses enfants.`);
            return;
        }
        const mat = this.resolveMaterial(target, matName);
        if (!mat) return;

        console.log(`[MatrixEffect] Slot "${slot}" appliqué sur mesh "${target.name}", mat "${mat.name}"`);
        this.patchTextureSlot(mat, slot);
    }

    /**
     * Restaure l'état original d'un slot (texture + propriétés matériau)
     * tel qu'il était avant l'appel à applyToTextureSlot.
     * Les propriétés du matériau (emissiveColor, disableLighting…) ne sont
     * restaurées que quand TOUS les slots de ce matériau ont été retirés.
     */
    public removeFromTextureSlot(
        mesh:     BABYLON.AbstractMesh,
        slot:     TextureSlot = "diffuse",
        matName?: string
    ): void {
        const target = this.findMeshWithMaterial(mesh, matName);
        if (!target) {
            console.warn(`[MatrixEffect] Aucun matériau "${matName ?? "(quelconque)"}" trouvé sur "${mesh.name}" ni ses enfants.`);
            return;
        }
        const mat = this.resolveMaterial(target, matName);
        if (!mat) return;

        this.restoreTextureSlot(mat, slot);
    }

    /** Modifie la couleur des caractères à la volée */
    public setColors(charColor: string, headColor?: string): void {
        this.charColor = charColor;
        if (headColor) this.headColor = headColor;
    }

    /** Libère toutes les ressources Babylon.js */
    public dispose(): void {
        this.dynTexture.dispose();
        this.material.dispose();
    }

    // ── Dessin ───────────────────────────────────

    private drawFrame(): void {
        const ctx  = this.matrixCtx;
        const size = this.canvasSize;
        const fz   = this.fontSize;

        ctx.fillStyle = this.fadeColor;
        ctx.fillRect(0, 0, size, size);
        ctx.font = `${fz}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = Math.random() > 0.5 ? "1" : "0";
            const y    = this.drops[i] * fz;

            ctx.fillStyle = this.drops[i] === 1 ? this.headColor : this.charColor;
            ctx.fillText(char, i * fz, y);

            if (y > size && Math.random() > 0.975) this.drops[i] = 0;
            this.drops[i]++;
        }
    }

    private update(): void {
        this.drawFrame();
        const bjsCtx = this.dynTexture.getContext() as CanvasRenderingContext2D;
        bjsCtx.drawImage(this.matrixCanvas, 0, 0);
        this.dynTexture.update();
    }

    // ── Patch / Restore ──────────────────────────

    private patchTextureSlot(mat: BABYLON.Material, slot: TextureSlot): void {
        const slotKey = `${mat.uniqueId}_${slot}`;

        if (mat instanceof BABYLON.StandardMaterial) {
            const slotMap: Partial<Record<TextureSlot, keyof BABYLON.StandardMaterial>> = {
                diffuse:    "diffuseTexture",
                emissive:   "emissiveTexture",
                ambient:    "ambientTexture",
                specular:   "specularTexture",
                bump:       "bumpTexture",
                opacity:    "opacityTexture",
                reflection: "reflectionTexture",
            };
            const key = slotMap[slot];
            if (!key) {
                console.warn(`[MatrixEffect] Slot "${slot}" non supporté sur StandardMaterial.`);
                return;
            }

            // Props du matériau : sauvegarder UNE SEULE FOIS (avant toute modification)
            if (!this.matStates.has(mat.uniqueId)) {
                this.matStates.set(mat.uniqueId, {
                    emissiveColor:   mat.emissiveColor.clone(),
                    disableLighting: mat.disableLighting,
                });
            }

            // Texture du slot
            this.slotStates.set(slotKey, { texture: (mat as any)[key] ?? null });

            (mat as unknown as Record<string, unknown>)[key as string] = this.dynTexture;

            if (slot === "diffuse" || slot === "emissive") {
                mat.emissiveColor   = new BABYLON.Color3(0, 0.85, 0.2);
                mat.disableLighting = true;
            }

        } else if (mat instanceof BABYLON.PBRMaterial) {
            const slotMap: Partial<Record<TextureSlot, keyof BABYLON.PBRMaterial>> = {
                albedo:   "albedoTexture",
                emissive: "emissiveTexture",
                bump:     "bumpTexture",
                metallic: "metallicTexture",
                opacity:  "opacityTexture",
                ambient:  "ambientTexture",
                diffuse:  "albedoTexture",
            };
            const key = slotMap[slot];
            if (!key) {
                console.warn(`[MatrixEffect] Slot "${slot}" non supporté sur PBRMaterial.`);
                return;
            }

            // Props du matériau : sauvegarder UNE SEULE FOIS
            if (!this.matStates.has(mat.uniqueId)) {
                this.matStates.set(mat.uniqueId, {
                    emissiveColor: mat.emissiveColor.clone(),
                    unlit:         mat.unlit,
                });
            }

            // Texture du slot
            this.slotStates.set(slotKey, { texture: (mat as any)[key] ?? null });

            (mat as unknown as Record<string, unknown>)[key as string] = this.dynTexture;

            if (slot === "albedo" || slot === "diffuse" || slot === "emissive") {
                mat.emissiveColor = new BABYLON.Color3(0, 0.85, 0.2);
                mat.unlit         = true;
            }

        } else {
            console.warn(`[MatrixEffect] Type de matériau non supporté : ${mat.getClassName()}`);
        }
    }

    private restoreTextureSlot(mat: BABYLON.Material, slot: TextureSlot): void {
        const slotKey   = `${mat.uniqueId}_${slot}`;
        const slotState = this.slotStates.get(slotKey);
        if (!slotState) {
            console.warn(`[MatrixEffect] Aucun état sauvegardé pour "${mat.name}" slot "${slot}"`);
            return;
        }

        if (mat instanceof BABYLON.StandardMaterial) {
            const slotMap: Partial<Record<TextureSlot, keyof BABYLON.StandardMaterial>> = {
                diffuse:    "diffuseTexture",
                emissive:   "emissiveTexture",
                ambient:    "ambientTexture",
                specular:   "specularTexture",
                bump:       "bumpTexture",
                opacity:    "opacityTexture",
                reflection: "reflectionTexture",
            };
            const key = slotMap[slot];
            if (key) (mat as unknown as Record<string, unknown>)[key as string] = slotState.texture;

        } else if (mat instanceof BABYLON.PBRMaterial) {
            const slotMap: Partial<Record<TextureSlot, keyof BABYLON.PBRMaterial>> = {
                albedo:   "albedoTexture",
                emissive: "emissiveTexture",
                bump:     "bumpTexture",
                metallic: "metallicTexture",
                opacity:  "opacityTexture",
                ambient:  "ambientTexture",
                diffuse:  "albedoTexture",
            };
            const key = slotMap[slot];
            if (key) (mat as unknown as Record<string, unknown>)[key as string] = slotState.texture;
        }

        this.slotStates.delete(slotKey);

        // Restaurer les props du matériau seulement quand il n'y a plus
        // aucun slot actif sur ce matériau
        const hasActiveSlots = [...this.slotStates.keys()]
            .some(k => k.startsWith(`${mat.uniqueId}_`));

        if (!hasActiveSlots) {
            const matState = this.matStates.get(mat.uniqueId);
            if (matState) {
                if (mat instanceof BABYLON.StandardMaterial) {
                    mat.emissiveColor   = matState.emissiveColor;
                    mat.disableLighting = matState.disableLighting ?? false;
                } else if (mat instanceof BABYLON.PBRMaterial) {
                    mat.emissiveColor = matState.emissiveColor;
                    mat.unlit         = matState.unlit ?? false;
                }
                this.matStates.delete(mat.uniqueId);
            }
        }
    }

    // ── Helpers privés ───────────────────────────

    private findMeshWithMaterial(
        mesh:     BABYLON.AbstractMesh,
        matName?: string
    ): BABYLON.AbstractMesh | null {
        if (this.meshHasMaterial(mesh, matName)) return mesh;
        for (const child of mesh.getChildMeshes()) {
            const found = this.findMeshWithMaterial(child, matName);
            if (found) return found;
        }
        return null;
    }

    private meshHasMaterial(mesh: BABYLON.AbstractMesh, matName?: string): boolean {
        const mat = mesh.material;
        if (!mat) return false;
        if (!matName) return true;
        if (mat instanceof BABYLON.MultiMaterial) {
            return mat.subMaterials.some((s) => s?.name === matName);
        }
        return mat.name === matName;
    }

    private resolveMaterial(
        mesh:     BABYLON.AbstractMesh,
        matName?: string
    ): BABYLON.Material | null {
        const mat = mesh.material;
        if (!mat) return null;
        if (mat instanceof BABYLON.MultiMaterial) {
            if (matName) {
                return mat.subMaterials.find((m) => m?.name === matName) ?? mat.subMaterials[0] ?? null;
            }
            return mat.subMaterials[0] ?? null;
        }
        return mat;
    }
}