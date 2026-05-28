import {AbstractMesh, Material, Texture} from "@babylonjs/core";

export class TextureSwitcher {
    static switch(texture : Material, mesh : AbstractMesh):void {
        mesh.material = texture;
    }
}