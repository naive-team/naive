import {Entity} from "./interfaces/Entity";
import {Commandable} from "./interfaces/Commandable";
import {GameContext} from "../util/GameContext";
import {Command} from "../Commands/Command";
import {AbstractMesh, MeshBuilder, Vector3} from "@babylonjs/core";
import {Color} from "../Commands/Color";
import {EntityFamily} from "./util/EntityFamily";
import {Firefly} from "./Firefly";
import {EntityManager} from "./util/EntityManager";

enum DoorState {
    CLOSED,
    OPENING,
    OPENED
}

export class Door implements Entity, Commandable {
    private leftMesh_: AbstractMesh;
    private rightMesh_: AbstractMesh;

    private collider_: AbstractMesh;
    private state_: DoorState = DoorState.OPENING;

    private color_: Color;
    private distanceTraveled_: number = 0;
    private proximityZone_: AbstractMesh;
    private id_: string;

    constructor(leftMesh: AbstractMesh, rightMesh: AbstractMesh, id: string = "door") {
        this.id_ = id;

        this.leftMesh_ = leftMesh;
        this.rightMesh_ = rightMesh;

        this.color_ = null;

        // this.collider_ = MeshBuilder.CreateBox("doorCollider", {size: 1});
        // this.collider_.position = this.leftMesh_.position;


        const proximityZone = MeshBuilder.CreateBox("blockProximityZone", {
            width: 2,
            height: 4,
            depth: 2
        });

        proximityZone.checkCollisions = false;
        proximityZone.visibility = 0;

        proximityZone.position = new Vector3(2, 0, -1.5);

        this.proximityZone_ = proximityZone;
    }

    execute(_ctx: GameContext, command: Command, _args: string[]): string {
        switch (command) {
            case Command.OPEN:
                if (this.state_ !== DoorState.CLOSED) return "ERROR: Door not closed";

                this.state_ = DoorState.OPENING;
                break;

            case Command.HELP:
                return "<targ> open"
                break;
        }


        return "OK";
    }

    getCollider(): AbstractMesh {
        return this.collider_;
    }

    getColor(): Color {
        return this.color_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.DOOR;
    }

    update(_ctx: GameContext): void {

        switch (this.state_) {
            case DoorState.CLOSED:
                break;

            case DoorState.OPENING:
                this.rightMesh_.position.x -= 0.01;
                this.leftMesh_.position.x += 0.01;

                this.distanceTraveled_ += 0.01;

                if (this.distanceTraveled_ > 1) {
                    this.state_ = DoorState.OPENED;
                }
                break;

            case DoorState.OPENED:
                break;
        }
    }

    attachFirefly(firefly: Firefly, entityManager: EntityManager): void {
        const targetPosition: Vector3 = new Vector3().copyFrom(this.proximityZone_.position);
        targetPosition.z += 0.3;

        this.color_ = firefly.getColor();

        firefly.attachToCommandable(this, targetPosition, entityManager)
    }

    getProximityZone(): AbstractMesh {
        return this.proximityZone_;
    }

    uncolor(): void {
        this.color_ = null;
    }

    getId(): string {
        return this.id_;
    }

}