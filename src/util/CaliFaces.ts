import {Color3, Scene, StandardMaterial, Texture} from "@babylonjs/core";

export class CaliFaces {
    public static starFace :StandardMaterial;
    public static normalFace :StandardMaterial;
    public static thxFace :StandardMaterial;
    public static winkFace :StandardMaterial;
    //TODO essayer de remplacer par des textures au lieu de material
    static initialize(scene : Scene) {
        this.starFace = new StandardMaterial("starFace", scene);
        this.initializeSingle(scene, this.starFace,"./starFace.png");

        this.normalFace = new StandardMaterial("normalFace", scene);
        this.initializeSingle(scene, this.normalFace,"./normalFace.png");

        this.thxFace = new StandardMaterial("thxFace", scene);
        this.initializeSingle(scene, this.thxFace,"./thxFace.png");

        this.winkFace = new StandardMaterial("winkFace", scene);
        this.initializeSingle(scene, this.winkFace,"./winkFace.png");
    }
    private static initializeSingle(scene : Scene, material : StandardMaterial, url:string) : void {
        material.diffuseTexture = new Texture(url, scene, false, false );
        //material.emissiveTexture = new Texture(url, scene, false, false);
        //material.emissiveColor = new Color3(1, 1, 1);
    }
    public static getStarFace(){
        return CaliFaces.starFace;
    }
    public static getMaterial(scene : Scene, url:string){
        let mat =  new StandardMaterial(url, scene);
        mat.diffuseTexture = new Texture(url, scene, false, false);
        return mat;

    }

}