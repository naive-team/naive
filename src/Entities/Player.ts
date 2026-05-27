import {
    AbstractMesh,
    AnimationGroup,
    Mesh,
    MeshBuilder,
    Scalar,
    Scene,
    Tools,
    TransformNode,
    Vector2,
    Vector3
} from "@babylonjs/core";
import {PlayerStateMachine} from "../States/PlayerStates/Animation/PlayerStateMachine";
import {PlayerIdleState} from "../States/PlayerStates/Animation/PlayerIdleState";
import {EntityManager} from "./util/EntityManager";
import {EntityFamily} from "./util/EntityFamily";
import {Entity} from "./interfaces/Entity";
import {GameContext} from "../util/GameContext";
import {Firefly} from "./Firefly";
import {Commandable} from "./interfaces/Commandable";


export class Player implements Entity {
    private ctx_: GameContext;
    private scene_: Scene;

    private collider_: Mesh;
    private readonly SPEED_: number = 0.1;

    private targetAngle_: number;

    private animations_: AnimationGroup[];
    private stateMachine_: PlayerStateMachine;

    private mesh_: AbstractMesh;
    private netCollider_: Mesh;

    private canMove_: boolean;
    private targetPosY_: number;
    private fireflies: Firefly[] = [];

    constructor(ctx: GameContext, scene: Scene, playerMesh: AbstractMesh, animations: AnimationGroup[]) {
        this.ctx_ = ctx;
        this.scene_ = scene;
        this.mesh_ = playerMesh;

        this.initCollider_(playerMesh);

        this.animations_ = animations;
        console.log(this.animations_);
        animations[0].pause();

        this.stateMachine_ = new PlayerStateMachine();
        this.stateMachine_.changeState(this, new PlayerIdleState());
        this.canMove_ = true;
    }

    private initCollider_(playerMesh: AbstractMesh): void {
        const height: number = 1.3;

        this.collider_ = MeshBuilder.CreateBox("player_collider", {
            width: 0.5,
            depth: 0.5,
            height: height
        });

        this.collider_.checkCollisions = true;

        this.collider_.visibility = 0;

        this.collider_.position.y += height / 2;
        this.targetPosY_ = this.collider_.position.y;
        playerMesh.position.y -= height / 2;
        playerMesh.rotation.y += Tools.ToRadians(180);

        playerMesh.parent = this.collider_;
        this.ctx_.playerCamera.lockOnEntity(this.collider_);

        const netRim: TransformNode = this.scene_.getTransformNodeByName("Armature").getChildTransformNodes(false).find((node: TransformNode): boolean=> {return node.name === "Torus"} );

        this.netCollider_ = MeshBuilder.CreateBox("net_collider", {size: 2});
        this.netCollider_.position.z = 0;
        this.netCollider_.position.y = 1;
        this.netCollider_.parent = netRim;

        this.netCollider_.visibility = 0;

    }

    move(inputVector: Vector2): void {
        const R: Vector3 = this.ctx_.playerCamera.getRightNormal();
        const F: Vector3 = this.ctx_.playerCamera.getForwardNormal();
        const x: number = inputVector.x;
        const y: number = inputVector.y;

        const movement: Vector3 = ( R.scaleInPlace(x) ).addInPlace( F.scaleInPlace(y) );

        movement.scaleInPlace(this.SPEED_);

        this.updateTargetAngle_(movement);

        this.collider_.moveWithCollisions(movement, false);
        this.collider_.position.y = this.targetPosY_;
    }

    private updateTargetAngle_(movement: Vector3): void {
        if (movement.equals(Vector3.Zero())) return;

        this.targetAngle_ = Math.atan2(movement.x, movement.z);
    }

    update(_ctx: GameContext): void {
        this.pointTowardTargetAngle_(this.ctx_.input.getInputVector());

        if (! this.canMove_) return;

        this.stateMachine_.update(this, this.ctx_.input, this.ctx_.entityManager);
    }

    private pointTowardTargetAngle_(inputVector: Vector2): void {
        if (this.targetAngle_ === undefined) return;
        if (inputVector.equals(Vector2.Zero())) return;

        this.collider_.rotation.y = Tools.ToRadians (
            Scalar.LerpAngle (
                Tools.ToDegrees(this.collider_.rotation.y),
                Tools.ToDegrees(this.targetAngle_),
                0.1
            )
        );
    }

    public startAnimation(name: string) {
        switch (name) {
            case "catch":
                this.animations_[0].play(false);
                this.animations_[3].play(false);
                this.animations_[6].play(false);
                break;
            case "idle":
                this.animations_[1].play(true);
                this.animations_[4].play(true);
                this.animations_[7].play(true);
                break;
            case "walk":
                this.animations_[2].play(true);
                this.animations_[5].play(true);
                this.animations_[8].play(true);
                break
        }
    }

    public stopAnimation(name: string) {
        switch (name) {
            case "catch":
                this.animations_[0].stop();
                this.animations_[3].stop();
                this.animations_[6].stop();
                break;
            case "idle":
                this.animations_[1].stop();
                this.animations_[4].stop();
                this.animations_[7].stop();
                break;
            case "walk":
                this.animations_[2].stop();
                this.animations_[5].stop();
                this.animations_[8].stop();
                break
        }
    }

    public getScene(): Scene {
        return this.scene_;
    }

    public getNetCollider(): Mesh {
        return this.netCollider_;
    }


    getCollider() {
        return this.collider_;
    }

    getFamily(): EntityFamily {
        return EntityFamily.PLAYER;
    }

    isNearPC(entityManager: EntityManager): boolean {
        const pc: Entity = entityManager.getEntityByFamily(EntityFamily.PC);

        if (pc === undefined) return false;

        const pcCollider: AbstractMesh = pc.getCollider();
        return pcCollider.intersectsMesh(this.collider_);
    }

    getNearbyCommandables(entityManager: EntityManager): Commandable[] {
        const result: Commandable[] = [];

        const commandables: Commandable[] = entityManager.getCommandables();

        for (const commandable of commandables) {
            if (commandable.getProximityZone().intersectsMesh(this.collider_)) result.push(commandable);
        }

        return result;
    }

    setVisible(value: boolean): void {
        this.mesh_.setEnabled(value);
    }

    public canMove(): boolean {
        return this.canMove_;
    }

    public setCanMove(value: boolean): void {
        this.canMove_ = value;
    }

    public addFirefly(firefly: Firefly): void {
        this.fireflies.push(firefly);
    }

    public popFirefly(): Firefly {
        if (this.fireflies.length === 0) return null;

        return this.fireflies.pop();
    }
}