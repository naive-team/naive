import {ArcRotateCamera, Vector3, Mesh} from "@babylonjs/core";

type ArcRotateCameraParams = ConstructorParameters<typeof ArcRotateCamera>;

export class PlayerCamera extends ArcRotateCamera {
    constructor(canvas: HTMLCanvasElement, ...args: ArcRotateCameraParams) {
        super(...args);
        this.attachControl(canvas);
        this.inertia = 0.4;
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

    lockTarget(playerCollider: Mesh) {
        this.lockedTarget = playerCollider;
    }

}