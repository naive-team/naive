
import {AbstractMesh, MeshBuilder} from "@babylonjs/core";
import {Entity} from "./util/Entity";
import {Bug} from "./util/Bug";
import {EntityFamily} from "./util/EntityFamily";

export class Beetle implements Entity, Bug {


    private collider_: AbstractMesh;

    constructor() {
        this.collider_ = MeshBuilder.CreateBox("beetle", {size: 0.1});
        this.collider_.checkCollisions = true;
        this.collider_.position.y = 1
        this.collider_.position.z = 1;

    }

    update(): void {

    }


    getCollider() {
        return this.collider_;
    }

    captured(): void {
        this.collider_.setEnabled(false);
    }

    getFamily(): EntityFamily {
        return EntityFamily.BUG;
    }


}