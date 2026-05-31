import {Entity} from "./interfaces/Entity";
import {Commandable} from "./interfaces/Commandable";
import {GameContext} from "../util/GameContext";
import {Command} from "../Commands/Command";
import {AbstractMesh, MeshBuilder, Vector3} from "@babylonjs/core";
import {Color} from "../Commands/Color";
import {EntityFamily} from "./util/EntityFamily";
import {Firefly} from "./Firefly";
import {EntityManager} from "./util/EntityManager";
import {LabScene} from "../Scenes/LabScene";

enum DoorState {
    CLOSED,
    OPENING,
    OPENED,
    JUST_OPENED,
    START_OPENING,//TODO partout a l exterieur ou on passe a opening il faut mettre start opening,
    CLOSING
}

export class Door implements Entity, Commandable {
    private leftMesh_: AbstractMesh;
    private rightMesh_: AbstractMesh;

    private collider_: AbstractMesh;
    private state_: DoorState = DoorState.CLOSED;

    private color_: Color;
    private distanceTraveled_: number = 0;
    private proximityZone_: AbstractMesh;
    private actionOnAttachFirefly:()=>void;
    private actionOnUnlinkFirefly:()=>void;
    private actionOnOpened:()=>void;
    private id_: string;

    private rightMeshOriginalPosX_: number;
    private leftMeshOriginalPosX_: number;

    constructor(leftMesh: AbstractMesh, rightMesh: AbstractMesh, id: string = "door",
                actionOnAttachFirefly:()=>void = ()=>{},
                actionOnUnlinkFirefly:()=>void = ()=>{},
                actionOnOpened:()=>void = ()=>{}) {

        this.id_ = id;

        this.leftMesh_ = leftMesh;
        this.rightMesh_ = rightMesh;

        this.rightMeshOriginalPosX_ = rightMesh.position.x;
        this.leftMeshOriginalPosX_ = leftMesh.position.x;

        this.color_ = null;

        // this.collider_ = MeshBuilder.CreateBox("doorCollider", {size: 1});
        // this.collider_.position = this.leftMesh_.position;


        const proximityZone = MeshBuilder.CreateBox("doorProximityZone", {
            width: 2,
            height: 4,
            depth: 1.5
        }, leftMesh.getScene());

        proximityZone.checkCollisions = false;
        proximityZone.visibility = 0;

        //proximityZone.position = new Vector3(2, 0, -1.5);
        proximityZone.parent = leftMesh.parent;
        proximityZone.position = new Vector3().copyFrom(leftMesh.position);
        //proximityZone.position.z -= 3.2;


        this.proximityZone_ = proximityZone;

        this.actionOnUnlinkFirefly = actionOnUnlinkFirefly;
        this.actionOnAttachFirefly = actionOnAttachFirefly;
        this.actionOnOpened = actionOnOpened;

    }

    execute(_ctx: GameContext, command: Command, _args: string[]): string {
        switch (command) {
            case Command.OPEN:
                if (this.state_ !== DoorState.CLOSED) return "ERROR: Door not closed";

                this.open();
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

                if (this.distanceTraveled_ >= 1) {
                    this.state_ = DoorState.JUST_OPENED;
                }
                break;

            case DoorState.OPENED:
                break;
            case DoorState.JUST_OPENED:
                this.state_ = DoorState.OPENED;
                break;
            case DoorState.START_OPENING:
                this.actionOnOpened();
                this.state_ = DoorState.OPENING;
                break;

            case DoorState.CLOSING:
                this.rightMesh_.position.x += 0.1;
                this.leftMesh_.position.x -= 0.1;

                this.distanceTraveled_ += 0.1;

                if (this.distanceTraveled_ >= 1) {
                    this.state_ = DoorState.CLOSED;
                    this.rightMesh_.position.x = this.rightMeshOriginalPosX_;
                    this.leftMesh_.position.x = this.leftMeshOriginalPosX_;
                }

                break;
        }
    }

    attachFirefly(firefly: Firefly, entityManager: EntityManager): void {
        const targetPosition: Vector3 = new Vector3().copyFrom(this.proximityZone_.getAbsolutePosition());
        targetPosition.z += 0.6;

        this.color_ = firefly.getColor();

        firefly.attachToCommandable(this, targetPosition, entityManager)
        this.actionOnAttachFirefly();
    }

    getProximityZone(): AbstractMesh {
        return this.proximityZone_;
    }

    uncolor(): void {
        this.color_ = null;
        this.actionOnUnlinkFirefly();
    }

    getId(): string {
        return this.id_;
    }

    open(){
        (this.rightMesh_.getScene() as LabScene).playSfx("doorOpening");
        this.state_ = DoorState.START_OPENING;
    }

    close(): void {
        if (this.state_ !== DoorState.OPENED && this.state_ !== DoorState.OPENING) return;

        this.distanceTraveled_ = 0;

        this.state_ = DoorState.CLOSING;
    }

    isOpened(): boolean {
        return this.state_ === DoorState.OPENING || this.state_ === DoorState.OPENED;
    }

}