import {AbstractMesh, Color3, DynamicTexture, Material, PBRMaterial, StandardMaterial, Texture} from "@babylonjs/core";

export class TextureSwitcher {
    static switch(texture: Texture, mesh: AbstractMesh): void {
        if (!mesh.material) {
            console.warn(`Mesh "${mesh.name}" has no material assigned.`);
            return;
        }

        if (mesh.material instanceof StandardMaterial) {
            mesh.material.diffuseTexture = texture;
        } else if (mesh.material instanceof PBRMaterial) {
            mesh.material.albedoTexture = texture;
        } else {
            console.warn(`Unsupported material type: ${mesh.material.getClassName()}`);
        }
    }

    // cette methode marche pas (efface la texture du visage mais affiche la dynamic texture)
    static applyEffect(texture: DynamicTexture, mesh: AbstractMesh): void {
        const mat = mesh.material as StandardMaterial;

        mat.emissiveTexture = texture;
        mat.emissiveColor = new Color3(1, 1, 1);
        mat.disableLighting = true;

        // Vérification immédiate
        console.log("emissiveTexture assignée ?", mat.emissiveTexture === texture);
        console.log("emissiveColor :", mat.emissiveColor);
        console.log("texture isReady ?", texture.isReady());
        console.log("mesh visible ?", mesh.isVisible, mesh.isEnabled());
    }
}