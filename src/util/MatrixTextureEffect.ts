import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

// ─────────────────────────────────────────────
// MatrixTextureEffect
// Remplace la texture d'un mesh importé par un
// effet "Matrix" (binaire vert animé) via un
// canvas 2D mis à jour chaque frame.
// ─────────────────────────────────────────────

export class MatrixTextureEffect {
    private readonly scene: BABYLON.Scene;
    private readonly matrixCanvas: HTMLCanvasElement;
    private readonly matrixCtx: CanvasRenderingContext2D;
    private readonly dynTexture: BABYLON.DynamicTexture;
    private readonly material: BABYLON.StandardMaterial;

    private readonly canvasSize: number = 512;
    private readonly fontSize: number = 14;
    private readonly cols: number;
    private readonly drops: number[];

    // Couleurs Matrix — personnalisables
    private charColor: string = "#00FF41";      // vert vif
    private headColor: string = "#AFFFBC";      // tête de colonne plus lumineuse
    private fadeColor: string = "rgba(0,0,0,0.05)"; // traîne

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        this.cols = Math.floor(this.canvasSize / this.fontSize);
        this.drops = Array(this.cols).fill(1);

        // 1. Canvas 2D hors DOM
        this.matrixCanvas = document.createElement("canvas");
        this.matrixCanvas.width = this.canvasSize;
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

        // 3. Matériau Standard
        this.material = new BABYLON.StandardMaterial("matrixMat", this.scene);
        this.material.diffuseTexture  = this.dynTexture;
        this.material.emissiveColor   = new BABYLON.Color3(0, 0.85, 0.2);
        this.material.disableLighting = true; // rendu auto-illuminé

        // 4. Boucle de rendu
        this.scene.registerBeforeRender(() => this.update());
    }
    getDynTexture(){
        return this.dynTexture;
    }
    // ── Dessin d'une frame Matrix ────────────────
    private drawFrame(): void {
        const ctx  = this.matrixCtx;
        const size = this.canvasSize;
        const fz   = this.fontSize;

        // Fondu du fond : crée l'effet de traîne
        ctx.fillStyle = this.fadeColor;
        ctx.fillRect(0, 0, size, size);

        ctx.font = `${fz}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = Math.random() > 0.5 ? "1" : "0";
            const y    = this.drops[i] * fz;

            // La tête de colonne est plus lumineuse
            ctx.fillStyle = this.drops[i] === 1 ? this.headColor : this.charColor;
            ctx.fillText(char, i * fz, y);

            // Reset aléatoire quand la goutte atteint le bas
            if (y > size && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    // ── Upload GPU ───────────────────────────────
    private update(): void {
        this.drawFrame();

        // Copier notre canvas vers le canvas interne de la DynamicTexture
        const bjsCtx = this.dynTexture.getContext() as CanvasRenderingContext2D;
        bjsCtx.drawImage(this.matrixCanvas, 0, 0);
        this.dynTexture.update(); // envoi au GPU
    }

    // ── API publique ─────────────────────────────

    /**
     * Remplace UNE seule texture (slot) sur un StandardMaterial ou PBRMaterial,
     * sans toucher aux autres slots ni aux autres matériaux du mesh.
     *
     * @param mesh   Le mesh cible
     * @param slot   Le slot à remplacer : "diffuse" | "emissive" | "albedo" | "bump" | ...
     * @param matName  (optionnel) Nom du sous-matériau si le mesh a un MultiMaterial.
     *                 Si omis, applique sur le 1er matériau trouvé.
     *
     * @example
     * // Remplace uniquement la diffuse d'un StandardMaterial
     * matrixFx.applyToTextureSlot(mesh, "diffuse");
     *
     * @example
     * // Remplace l'albedo d'un sous-matériau PBR nommé "Screen_Mat"
     * matrixFx.applyToTextureSlot(mesh, "albedo", "Screen_Mat");
     */
    public applyToTextureSlot(
        mesh: BABYLON.AbstractMesh,
        slot: TextureSlot = "diffuse",
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

    // ── Helpers privés ───────────────────────────

    /**
     * Descend récursivement dans le mesh et ses enfants pour trouver
     * le premier qui possède le matériau (ou sous-matériau) demandé.
     * Retourne le mesh lui-même s'il convient directement.
     */
    private findMeshWithMaterial(
        mesh: BABYLON.AbstractMesh,
        matName?: string
    ): BABYLON.AbstractMesh | null {
        if (this.meshHasMaterial(mesh, matName)) return mesh;

        for (const child of mesh.getChildMeshes()) {
            const found = this.findMeshWithMaterial(child, matName);
            if (found) return found;
        }
        return null;
    }

    /** Vérifie qu'un mesh possède le matériau (ou sous-matériau) demandé. */
    private meshHasMaterial(mesh: BABYLON.AbstractMesh, matName?: string): boolean {
        const mat = mesh.material;
        if (!mat) return false;
        if (!matName) return true;

        if (mat instanceof BABYLON.MultiMaterial) {
            return mat.subMaterials.some((s) => s?.name === matName);
        }
        return mat.name === matName;
    }

    /**
     * Trouve le bon mesh parmi la liste importée.
     * Priorité : meshName → matName → 1er mesh avec matériau.
     */
    private findTarget(
        meshes: BABYLON.AbstractMesh[],
        meshName?: string,
        matName?: string
    ): BABYLON.AbstractMesh | undefined {
        if (meshName) {
            return meshes.find((m) => m.name === meshName);
        }
        if (matName) {
            return meshes.find((m) => {
                const mat = m.material;
                if (!mat) return false;
                if (mat instanceof BABYLON.MultiMaterial) {
                    return mat.subMaterials.some((s) => s?.name === matName);
                }
                return mat.name === matName;
            });
        }
        return meshes.find((m) => m.material != null);
    }

    /**
     * Résout le bon matériau sur un mesh donné.
     * Gère MultiMaterial (par nom ou index 0) et matériau simple.
     */
    private resolveMaterial(
        mesh: BABYLON.AbstractMesh,
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

        // Matériau simple — accepté directement
        return mat;
    }

    /**
     * Injecte la DynamicTexture dans le bon slot selon le type de matériau.
     * Supporte StandardMaterial et PBRMaterial.
     */
    private patchTextureSlot(mat: BABYLON.Material, slot: TextureSlot): void {
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
            (mat as unknown as Record<string, unknown>)[key as string] = this.dynTexture;

            // Pour diffuse/emissive, ajouter la lueur verte
            if (slot === "diffuse" || slot === "emissive") {
                mat.emissiveColor   = new BABYLON.Color3(0, 0.85, 0.2);
                mat.disableLighting = true;
            }

        } else if (mat instanceof BABYLON.PBRMaterial) {
            const slotMap: Partial<Record<TextureSlot, keyof BABYLON.PBRMaterial>> = {
                albedo:    "albedoTexture",
                emissive:  "emissiveTexture",
                bump:      "bumpTexture",
                metallic:  "metallicTexture",
                opacity:   "opacityTexture",
                ambient:   "ambientTexture",
                diffuse:   "albedoTexture", // alias pratique
            };
            const key = slotMap[slot];
            if (!key) {
                console.warn(`[MatrixEffect] Slot "${slot}" non supporté sur PBRMaterial.`);
                return;
            }
            (mat as unknown as Record<string, unknown>)[key as string] = this.dynTexture;

            if (slot === "albedo" || slot === "diffuse" || slot === "emissive") {
                mat.emissiveColor   = new BABYLON.Color3(0, 0.85, 0.2);
                mat.unlit           = true; // équivalent disableLighting pour PBR
            }

        } else {
            console.warn(`[MatrixEffect] Type de matériau non supporté : ${mat.getClassName()}`);
        }
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
}

// ─────────────────────────────────────────────
// Type utilitaire — slots de texture supportés
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
