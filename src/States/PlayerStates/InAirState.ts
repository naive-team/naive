import {PlayerState} from "./PlayerState";
import {CharacterSupportedState, CharacterSurfaceInfo, PhysicsCharacterController, Vector3} from "@babylonjs/core";
import {OnGroundState} from "./OnGroundState";
import {PlayerPhysics} from "../../PlayerPhysics";

export class InAirState extends PlayerState {
    public getNextState(support: CharacterSupportedState, _playerPhysics: PlayerPhysics): PlayerState {
        if (support == CharacterSupportedState.SUPPORTED) {
            return new OnGroundState();
        }
        return this;
    }

    public override getDesiredVelocity(characterController: PhysicsCharacterController, playerPhysics: PlayerPhysics, deltaTime: number, _supportInfo: CharacterSurfaceInfo): Vector3 {
        let upWorld: Vector3 = playerPhysics.characterGravity.normalizeToNew();
        upWorld.scaleInPlace(-1.0);
        let forwardWorld: Vector3 = playerPhysics.forwardLocalSpace.applyRotationQuaternion(playerPhysics.characterOrientation);
        let desiredVelocity: Vector3 = playerPhysics.inputDirection.scale(playerPhysics.inAirSpeed).applyRotationQuaternion(playerPhysics.characterOrientation);
        let outputVelocity: Vector3 = characterController.calculateMovement(deltaTime, forwardWorld, upWorld, characterController.getVelocity(), Vector3.ZeroReadOnly, desiredVelocity, upWorld);
        outputVelocity.addInPlace(upWorld.scale(-outputVelocity.dot(upWorld)));
        outputVelocity.addInPlace(upWorld.scale(characterController.getVelocity().dot(upWorld)));
        outputVelocity.addInPlace(playerPhysics.characterGravity.scale(deltaTime));
        return outputVelocity;
    }
}