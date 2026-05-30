import {Entity} from "./interfaces/Entity";
import {AbstractMesh} from "@babylonjs/core";
import {EntityFamily} from "./util/EntityFamily";
import {GameContext} from "../util/GameContext";
import {Button} from "./Button"

enum SecureDoorState {
    CLOSED,
    OPENING,
    OPENED,
    CLOSING,
    JUST_OPENED
}

export class SecureDoor implements Entity {
    private mesh_: AbstractMesh;
    private id_: string;
    private state_: SecureDoorState = SecureDoorState.CLOSED;

    private upperYLimit: number = 4;
    private lowerYLimit_: number;
    private action;


    constructor(mesh: AbstractMesh, id: string = "secureDoor", action:()=>void = ()=>{}) {
        this.mesh_ = mesh;
        this.id_ = id;
        
        this.lowerYLimit_ = this.mesh_.position.y;
        this.action = action;
    }


    getCollider(): AbstractMesh {
        return this.mesh_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.SECURE_DOOR;
    }

    getId(): string {
        return this.id_;
    }

    update(ctx: GameContext): void {
        switch(this.state_) {
            case SecureDoorState.CLOSED:
                this.checkButtonsPressed_(ctx);

                break;
            case SecureDoorState.OPENING:
                this.mesh_.position.y += 0.2;

                if (this.mesh_.position.y >= this.upperYLimit) {
                    this.mesh_.position.y = this.upperYLimit;
                    this.state_ = SecureDoorState.JUST_OPENED;
                }
                break;

            case SecureDoorState.OPENED:
                this.checkButtonsReleased_(ctx);
                break;

            case SecureDoorState.JUST_OPENED:
                this.action();
                this.state_ = SecureDoorState.OPENED;
                this.checkButtonsReleased_(ctx);
                break;

            case SecureDoorState.CLOSING:
                this.mesh_.position.y -= 0.2;

                if (this.mesh_.position.y <= this.lowerYLimit_) {
                    this.mesh_.position.y = this.lowerYLimit_;
                    this.state_ = SecureDoorState.CLOSED;
                }
                
                break;
        }
    }

    private checkButtonsPressed_(ctx: GameContext): void {
        const button1: Button = ctx.entityManager.getEntityById("button1") as Button;
        const button2: Button = ctx.entityManager.getEntityById("button2") as Button;

        if (button1.isPressed() && button2.isPressed()) {
            this.state_ = SecureDoorState.OPENING;
        }
    }
    
    private checkButtonsReleased_(ctx: GameContext): void {
        const button1: Button = ctx.entityManager.getEntityById("button1") as Button;
        const button2: Button = ctx.entityManager.getEntityById("button2") as Button;

        if ( ! (button1.isPressed() && button2.isPressed()) ) {
            this.state_ = SecureDoorState.CLOSING;
        }
    }
}