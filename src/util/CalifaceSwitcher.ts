import {AbstractMesh, Scene, Texture} from "@babylonjs/core";
import {TextureSwitcher} from "./TextureSwitcher";
import {CaliFaces} from "./CaliFaces";
import {MatrixTextureEffect} from "./MatrixTextureEffect";

export class CalifaceSwitcher {
    califace:AbstractMesh;
     matrixFx;
     inMatrixEffect = false;
    constructor(califace:AbstractMesh, scene:Scene) {
        this.califace = califace;
        this.matrixFx = new MatrixTextureEffect(scene);
    }
    public switch(texture:Texture){
        if (this.inMatrixEffect){
            this.removeMatrixEffect();
        }
        this.inMatrixEffect = false;
        TextureSwitcher.switch(texture, this.califace);
    }
    public switchThenNormalFace (texture:Texture, timeout:number = 2000){
        this.switch(texture);
        setTimeout(() => {
            this.switch(CaliFaces.normalFace);
        }, timeout);
    }
    public applyMatrixEffect(){
        this.inMatrixEffect = true;
        this.matrixFx.applyToTextureSlot(this.califace, "diffuse");
        this.matrixFx.applyToTextureSlot(this.califace, "emissive");
        setTimeout(() => {
            this.switch(CaliFaces.normalFace);
        }, 3000);

    }
    public removeMatrixEffect(): void {
        this.matrixFx.removeFromTextureSlot(this.califace, "diffuse");
        this.matrixFx.removeFromTextureSlot(this.califace, "emissive");
    }
}