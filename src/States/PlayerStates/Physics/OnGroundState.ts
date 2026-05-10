import {CharacterSupportedState, CharacterSurfaceInfo, PhysicsCharacterController, Vector3} from "@babylonjs/core";
import {InAirState} from "./InAirState";
import {StartJumpState} from "./StartJumpState";
import {PlayerPhysicsState} from "./PlayerPhysicsState";
import {PlayerPhysics} from "../../../PlayerPhysics";

export class OnGroundState extends PlayerPhysicsState {

    public getNextState(support: CharacterSupportedState, playerPhysics: PlayerPhysics): PlayerPhysicsState {
        if (support != CharacterSupportedState.SUPPORTED) {
            return new InAirState();
        }
        if (playerPhysics.wantJump) {
            return new StartJumpState();
        }
        return this;
    }

    public override getDesiredVelocity(characterController: PhysicsCharacterController, playerPhysics: PlayerPhysics, deltaTime: number, supportInfo: CharacterSurfaceInfo): Vector3 {
        let upWorld: Vector3 = playerPhysics.characterGravity.normalizeToNew();
        upWorld.scaleInPlace(-1.0);
        let forwardWorld: Vector3 = playerPhysics.forwardLocalSpace.applyRotationQuaternion(playerPhysics.characterOrientation);
        // Move character relative to the surface we're standing on
        // Correct input velocity to apply instantly any changes in the velocity of the standing surface and this way
        // avoid artifacts caused by filtering of the output velocity when standing on moving objects.
        let desiredVelocity: Vector3 = playerPhysics.inputDirection.scale(playerPhysics.onGroundSpeed).applyRotationQuaternion(playerPhysics.characterOrientation);

        let outputVelocity: Vector3 = characterController.calculateMovement(deltaTime, forwardWorld, supportInfo.averageSurfaceNormal, characterController.getVelocity(), supportInfo.averageSurfaceVelocity, desiredVelocity, upWorld);
        // Horizontal projection
        {
            outputVelocity.subtractInPlace(supportInfo.averageSurfaceVelocity);
            let inv1k: number = 1e-3;
            if (outputVelocity.dot(upWorld) > inv1k) {
                let velLen: number = outputVelocity.length();
                outputVelocity.normalizeFromLength(velLen);

                // Get the desired length in the horizontal direction
                let horizLen: number = velLen / supportInfo.averageSurfaceNormal.dot(upWorld);

                // Re project the velocity onto the horizontal plane
                let c: Vector3 = supportInfo.averageSurfaceNormal.cross(outputVelocity);
                outputVelocity = c.cross(upWorld);
                outputVelocity.scaleInPlace(horizLen);
            }
            outputVelocity.addInPlace(supportInfo.averageSurfaceVelocity);
            return outputVelocity;
        }
    }
}