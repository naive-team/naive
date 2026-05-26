import {Commandable} from "./interfaces/Commandable";
import {Entity} from "./interfaces/Entity";
import {Command} from "../Commands/Command";
import {EntityFamily} from "./util/EntityFamily";
import {GameContext} from "../util/GameContext";
import {Color} from "../Commands/Color";

import {AbstractMesh, MeshBuilder, Vector3} from '@babylonjs/core';

enum BlockState {
    MOVING,
    IDLE
}

export class Block implements Entity, Commandable {
    private color_: Color;
    private collider_: AbstractMesh;
    private mesh_: AbstractMesh;
    private state_: BlockState = BlockState.IDLE;
    private rotationAxis_: string;
    private direction_: string;
    private remainingDistance_: number;
    private colliderOffset_: Vector3 = new Vector3(0, 0.5, 0);

    constructor(blockMesh: AbstractMesh) {
        this.color_ = Color.YELLOW; // En attendant pour tester (devrait être à null normalement)
        this.mesh_ = blockMesh;

        const boundingInfo = this.mesh_.getBoundingInfo();

        const min = boundingInfo.boundingBox.minimumWorld;
        const max = boundingInfo.boundingBox.maximumWorld;

        const size = max.subtract(min);

        const collider = MeshBuilder.CreateBox("collider", {
            width: size.x,
            height: size.y,
            depth: size.z
        });

        collider.position.y += 0.5;

        collider.checkCollisions = true;
        collider.visibility = 0.5;

        this.collider_ = collider;

        this.collider_.position.z = 2;
        this.mesh_.position.z = 2;
    }

    execute(_ctx: GameContext, command: Command, args: string[]): string {
        switch (command) {
            case Command.MOVE:
                if (args.length !== 1  && args.length !== 2) return "ERROR: not enough args"

                const direction: string = args[0];
                const allowedDirections: string[] = ["north", "south", "east", "west"];

                if (! allowedDirections.includes(direction)) return "ERROR: Invalid direction";

                let distance: number;
                if (args.length === 2) {
                    distance = Number(args[1]);

                    if (Number.isNaN(distance)) return "ERROR: check distance arg";
                }
                else distance = 1;

                this.startMovement_(direction, distance);

                return "OK";
            case Command.HELP:
                return "<targ> move <dir> <dist>";
        }


    }

    getCollider() {
        return this.collider_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.BLOCK;
    }

    update(_ctx: GameContext): void {
        this.updateCollider_();

        this.updateMovement_();
    }

    updateCollider_(): void {
        this.collider_.position = new Vector3().copyFrom(this.mesh_.position).addInPlace(this.colliderOffset_);
        this.collider_.rotation = this.mesh_.rotation;
    }

    getColor(): Color {
        return this.color_;
    }

    private startMovement_(direction: string, distance: number): void{
        if (this.state_ === BlockState.MOVING) return;

        this.state_ = BlockState.MOVING;

        this.direction_ = direction;
        this.remainingDistance_ = distance
    }


    private updateMovement_(): void {
        if (this.remainingDistance_ <= 0) {
            this.state_ = BlockState.IDLE;
            return;
        }

        switch(this.direction_) {
            case "north":
                this.mesh_.position.z += 0.1
                break;
            case "south":
                this.mesh_.position.z -= 0.1;
                break;
            case "east":
                this.mesh_.position.x += 0.1;
                break;
            case "west":
                this.mesh_.position.x -= 0.1;
                break;
        }

        this.remainingDistance_ -= 0.1;
    }
}