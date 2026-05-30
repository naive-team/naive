import {Entity} from "./interfaces/Entity";
import {AbstractMesh, MeshBuilder, Tools, Vector3} from "@babylonjs/core";
import {EntityFamily} from "./util/EntityFamily";
import {GameContext} from "../util/GameContext";
import {Bug} from "./interfaces/Bug";
import {EntityManager} from "./util/EntityManager";
import {Player} from "./Player";
import {Color} from "../Commands/Color";
import {Commandable} from "./interfaces/Commandable";
import {BugCounter} from "../UI/BugCounter";
import {LabScene} from "../Scenes/LabScene";

export class Firefly implements Entity, Bug {
    private mesh_;
    private collider_;
    private time_: number = 0;
    private color_: Color;

    private static readonly HOVER_AMPLITUDE = 0.08;
    private static readonly HOVER_SPEED = 2;
    private baseY_: number;
    private commandedObject_: Commandable = null;
    private actionOnCatch:()=>void;
    private id_: string;

    constructor(mesh: AbstractMesh, id: string = "firefly", actionOnCatch:()=>void=()=>{}) {
        this.id_ = id;

        this.mesh_ = mesh;

        const scaling: number = 0.4;

        this.mesh_.scaling.x = scaling;
        this.mesh_.scaling.y = scaling;
        this.mesh_.scaling.z = scaling;

        this.collider_ = MeshBuilder.CreateBox("firefly", {size: 0.3});
        this.collider_.checkCollisions = false;

        this.collider_.visibility = 0;

        this.mesh_.parent = this.collider_;

        this.collider_.position = new Vector3(-1.11, 1, 7.93);
        this.baseY_ = this.collider_.position.y;

        this.collider_.rotation.y = Tools.ToRadians(180);

        this.color_ = Color.YELLOW;
        this.actionOnCatch = actionOnCatch;
    }

    getCollider(): AbstractMesh {
        return this.collider_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.BUG;
    }

    update(_ctx: GameContext): void {
        this.time_ += 0.02;
        this.collider_.position.y = this.baseY_ + Math.sin(this.time_ * Firefly.HOVER_SPEED) * Firefly.HOVER_AMPLITUDE;
    }

    captured(entityManager: EntityManager, ui:BugCounter): void {
        this.collider_.setEnabled(false);
        entityManager.remove(this);

        const player: Player = entityManager.getPlayer();
        player.addFirefly(this);

        if (this.commandedObject_) {
            this.commandedObject_.uncolor();
        }
        this.actionOnCatch();
        ui.increment();

        this.mesh_.getScene().playSfx("bugCatch");
    }

    attachToCommandable(commandable: Commandable, position: Vector3, entityManager: EntityManager): void {
        this.commandedObject_ = commandable;

        this.collider_.setEnabled(true);
        entityManager.add(this);

        this.collider_.position = new Vector3().copyFrom(position);

        this.mesh_.getScene().playSfx("releaseBug");
    }

    getColor(): Color {
        return this.color_;
    }

    getId(): string {
        return this.id_;
    }

}