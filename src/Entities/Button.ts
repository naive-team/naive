import {Entity} from "./interfaces/Entity";
import {AbstractMesh, MeshBuilder, Vector3} from "@babylonjs/core";
import {EntityFamily} from "./util/EntityFamily";
import {GameContext} from "../util/GameContext";

enum ButtonState {
    PRESSED,
    RELEASED,
    BEING_PRESSED,
    BEING_RELEASED
}

export class Button implements Entity {
    private mesh_: AbstractMesh;
    private state_: ButtonState = ButtonState.RELEASED;

    private lowerYLimit: number = -0.4;
    private upperYLimit: number = -0.25;

    private meshCollided_: AbstractMesh = null;
    private id_: string;

    private intersectZone_: AbstractMesh;


    constructor(mesh: AbstractMesh, id: string = "button") {
        this.id_ = id;

        const scaling = 0.3;

        mesh.scaling.x = scaling;
        mesh.scaling.y = scaling;
        mesh.scaling.z = scaling;

        this.intersectZone_ = MeshBuilder.CreateBox("buttonIntersectZone", {height: 0.3, width: 0.5, depth: 0.5}, mesh.getScene());
        this.intersectZone_.isVisible = false;

        this.mesh_ = mesh;
    }

    getCollider(): AbstractMesh {
        return this.mesh_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.BUTTON;
    }

    update(ctx: GameContext): void {
        if (this.state_ === ButtonState.RELEASED) this.intersectZone_.position = new Vector3().copyFrom(this.mesh_.position);

        switch (this.state_) {
            case ButtonState.PRESSED:
                this.checkExitCollision_();
                break;
            case ButtonState.RELEASED:
                this.checkCollision_(ctx);
                break;
            case ButtonState.BEING_PRESSED:

                this.mesh_.position.y -= 0.05;

                if (this.mesh_.position.y <= this.lowerYLimit) {
                    this.mesh_.position.y = this.lowerYLimit;
                    this.state_ = ButtonState.PRESSED;
                }

                this.checkExitCollision_();

                break;
            case ButtonState.BEING_RELEASED:
                this.mesh_.position.y += 0.05;

                if (this.mesh_.position.y >= this.upperYLimit) {
                    this.mesh_.position.y = this.upperYLimit;
                    this.state_ = ButtonState.RELEASED;
                    return;
                }

                this.checkCollision_(ctx);

                break;
        }
    }

    private checkCollision_(ctx: GameContext): void {
        if (this.meshCollided_) return;

        const candidates: Entity[] = ctx.entityManager.getAllEntities();

        for (const candidate of candidates) {
            if (candidate === undefined) continue;
            if (candidate.getFamily() === EntityFamily.BUTTON) continue;

            const candidateCollider: AbstractMesh = candidate.getCollider();

            if (candidateCollider === undefined) continue;

            if (candidateCollider.intersectsMesh(this.intersectZone_)) {

                this.meshCollided_ = candidate.getCollider();
                this.state_ = ButtonState.BEING_PRESSED;
                return;
            }
        }
    }


    private checkExitCollision_(): void {
        if (this.meshCollided_ === null) return;

        const collide: boolean = this.intersectZone_.intersectsMesh(this.meshCollided_);

        if (! collide) {
            this.state_ = ButtonState.BEING_RELEASED;
            this.meshCollided_ = null;
        }
    }

    setPosition(x: number, y: number, z: number): void {
        this.mesh_.position = new Vector3(x, y, z);
    }

    getId(): string {
        return this.id_;
    }

    isPressed(): boolean {
        return this.state_ === ButtonState.PRESSED;
    }
}