import {Color3, Scene, StandardMaterial, Texture} from "@babylonjs/core";

export class CaliFaces {
    public static starFace :Texture;
    public static normalFace :Texture;
    public static thxFace :Texture;
    public static winkFace :Texture;
    public static sadFace :Texture;
    static initialize(scene : Scene) {
        this.starFace = new Texture("./starFace.png", scene, false, false );

        this.normalFace = new Texture("./normalFace.png", scene, false, false );

        this.thxFace = new Texture("./thxFace.png", scene, false, false );

        this.winkFace = new Texture("./winkFace.png", scene, false, false );

        this.sadFace = new Texture("./sadFace.png", scene, false, false );

    }

}