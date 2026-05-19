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
import {PlayerCamera} from "../util/PlayerCamera";
import {Input} from "../Input/Input";
import {PlayerStateMachine} from "../States/PlayerStates/Animation/PlayerStateMachine";
import {PlayerIdleState} from "../States/PlayerStates/Animation/PlayerIdleState";
import {Entity} from "./util/Entity";
import {EntityManager} from "./util/EntityManager";
import {EntityFamily} from "./util/EntityFamily";


export class Player implements Entity {
    private scene_: Scene;
    private collider_: Mesh;
    private camera_: PlayerCamera;
    private input_: Input;
    private readonly SPEED_: number = 0.1;

    private targetAngle_: number;

    private animations_: AnimationGroup[];

    private stateMachine_: PlayerStateMachine;
    private entityManager_: EntityManager;

    private netCollider_: Mesh;

    constructor(scene: Scene, input: Input, canvas: HTMLCanvasElement, playerMesh: AbstractMesh, animations: AnimationGroup[], entityManager: EntityManager) {
        this.scene_ = scene;
        this.input_ = input;

        this.camera_ = new PlayerCamera(canvas, "player_camera", 0, 0, 3, new Vector3(0, 0, 0), scene);
        scene.activeCamera = this.camera_;

        this.initCollider_(playerMesh);

        this.animations_ = animations;
        console.log(this.animations_);
        animations[0].pause();

        this.stateMachine_ = new PlayerStateMachine(new PlayerIdleState());
        this.entityManager_ = entityManager;
    }

    private initCollider_(playerMesh: AbstractMesh): void {
        const height: number = 1.3;

        this.collider_ = MeshBuilder.CreateBox("player_collider", {
            width: 0.5,
            depth: 0.5,
            height: height
        });

        this.collider_.checkCollisions = true;

        this.collider_.isVisible = false;

        this.collider_.position.y += height / 2;
        playerMesh.position.y -= height / 2;
        playerMesh.rotation.y += Tools.ToRadians(180);

        playerMesh.parent = this.collider_;

        const netRim: TransformNode = this.scene_.getTransformNodeByName("Armature").getChildTransformNodes(false).find((node: TransformNode): boolean=> {return node.name === "Torus"} );

        this.netCollider_ = MeshBuilder.CreateBox("net_collider", {size: 2});
        this.netCollider_.position.z = 0;
        this.netCollider_.position.y = 1;
        this.netCollider_.parent = netRim;

    }

    move(inputVector: Vector2): void {
        const R: Vector3 = this.camera_.getRightNormal();
        const F: Vector3 = this.camera_.getForwardNormal();
        const x: number = inputVector.x;
        const y: number = inputVector.y;

        const movement: Vector3 = ( R.scaleInPlace(x) ).addInPlace( F.scaleInPlace(y) );

        movement.scaleInPlace(this.SPEED_);

        this.updateTargetAngle_(movement);

        this.collider_.moveWithCollisions(movement);
    }

    private updateTargetAngle_(movement: Vector3): void {
        if (movement.equals(Vector3.Zero())) return;

        this.targetAngle_ = Math.atan2(movement.x, movement.z);
    }

    update(): void {

        this.pointTowardTargetAngle_(this.input_.getInputVector());
        this.stateMachine_.update(this, this.input_, this.entityManager_);
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
}