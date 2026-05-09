import {Mesh, MeshBuilder, Scalar, Scene, Vector2, Vector3, Tools, AbstractMesh, AnimationGroup} from "@babylonjs/core";
import {PlayerCamera} from "./PlayerCamera";
import {Input} from "./Input";

export class Player {
    private scene_: Scene;
    private collider_: Mesh;
    private camera_: PlayerCamera;
    private input_: Input;
    private readonly SPEED_: number = 0.1;

    private targetAngle_: number;

    private animations_: AnimationGroup[];

    constructor(scene: Scene, input: Input, canvas: HTMLCanvasElement, playerMesh: AbstractMesh, animations: AnimationGroup[]) {
        this.scene_ = scene;
        this.input_ = input;

        this.camera_ = new PlayerCamera(canvas, "player_camera", 0, 0, 3, new Vector3(0, 0, 0), scene);
        scene.activeCamera = this.camera_;

        this.initCollider_(playerMesh);

        this.animations_ = animations;
        animations[0].pause();
    }

    private initCollider_(playerMesh) {
        const height: number = 1.3;

        this.collider_ = MeshBuilder.CreateBox("player_collider", {
            width: 0.5,
            depth: 0.5,
            height: height
        });

        this.collider_.isVisible = false;

        this.collider_.position.y += height / 2;
        playerMesh.position.y -= height / 2;

        playerMesh.rotation.y += Tools.ToRadians(180);

        playerMesh.parent = this.collider_;
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
        this.move(this.input_.getInputVector());
        this.pointTowardTargetAngle_(this.input_.getInputVector());
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
}