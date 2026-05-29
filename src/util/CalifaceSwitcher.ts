import {AbstractMesh, Texture} from "@babylonjs/core";
import {TextureSwitcher} from "./TextureSwitcher";
import {CaliFaces} from "./CaliFaces";

export class CalifaceSwitcher {
    califace:AbstractMesh;
    constructor(califace:AbstractMesh) {
        this.califace = califace;
    }
    public switch(texture:Texture){
        TextureSwitcher.switch(texture, this.califace);
    }
    public switchThenNormalFace (texture:Texture, timeout:number = 2000){
        TextureSwitcher.switch(texture, this.califace);
        setTimeout(() => {
            TextureSwitcher.switch(CaliFaces.normalFace, this.califace);
        }, timeout);
    }
}