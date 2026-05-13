import {Entity} from "./interfaces/Entity";
import {EntityFamily} from "./util/EntityFamily";
import {AbstractMesh, MeshBuilder, Scene} from "@babylonjs/core";

export class PC implements Entity {
    private collider_: AbstractMesh;

    constructor() {
        this.collider_ = MeshBuilder.CreateBox("PC", {size: 0.3});
        this.collider_.checkCollisions = false;
        this.collider_.position.y = 1
    }


    getCollider(): AbstractMesh {
        return this.collider_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.PC;
    }

    update(): void {
    }



}