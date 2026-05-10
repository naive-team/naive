import {Entity} from "./Entity";
import {AbstractMesh, MeshBuilder} from "@babylonjs/core";

export class Beetle implements Entity {
    private collider_: AbstractMesh;

    constructor() {
        this.collider_ = MeshBuilder.CreateBox("beetle", {size: 0.1});
        this.collider_.checkCollisions = true;
        this.collider_.position.y = 1
        this.collider_.position.z = 1;

    }

    update(): void {

    }
}