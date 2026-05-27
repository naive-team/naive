
import {AbstractMesh, MeshBuilder} from "@babylonjs/core";
import {EntityFamily} from "./util/EntityFamily";
import {Entity} from "./interfaces/Entity";
import {Bug} from "./interfaces/Bug";
import {EntityManager} from "./util/EntityManager";

export class Beetle implements Entity, Bug {


    private collider_: AbstractMesh ;

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

    captured(_entityManager: EntityManager): void {
        this.collider_.setEnabled(false);
    }

    getFamily(): EntityFamily {
        return EntityFamily.BUG;
    }


}