import {ArcRotateCamera, Vector3, AbstractMesh} from "@babylonjs/core";

type ArcRotateCameraParams = ConstructorParameters<typeof ArcRotateCamera>;

export class PlayerCamera extends ArcRotateCamera {
    constructor(canvas: HTMLCanvasElement, ...args: ArcRotateCameraParams) {
        super(...args);
        this.attachControl(canvas);
        this.inertia = 0.4;

        this._scene.activeCamera = this;

        this.radius = 6;
        this.alpha = 0.9821;
        this.beta = 1.19;

        this.lowerBetaLimit = 0.2;
        this.upperBetaLimit = 1.6;

        this.lowerRadiusLimit = this.radius;
        this.upperRadiusLimit = this.radius;
    }

    getForwardNormal(): Vector3 {
        const direction: Vector3 = this.getForwardRay().direction;
        const forward: Vector3 = new Vector3(direction.x, 0, direction.z);

        forward.normalize();

        return forward;
    }

    getRightNormal(): Vector3 {
        const forward = this.getForwardNormal();

        const right: Vector3 = new Vector3(forward.z, 0, -forward.x);
        right.normalize();

        return right;
    }

    lockOnEntity(entityCollider: AbstractMesh): void {
        this.lockedTarget = entityCollider;
    }

}