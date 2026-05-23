import {CharacterSupportedState, CharacterSurfaceInfo, PhysicsCharacterController, Vector3} from "@babylonjs/core";
import {PlayerPhysics} from "../../../PlayerPhysics";

export abstract class PlayerPhysicsState {
    public abstract getNextState(support: CharacterSupportedState, playerPhysics: PlayerPhysics): PlayerPhysicsState;

    public getDesiredVelocity(_characterController: PhysicsCharacterController, _playerPhysics: PlayerPhysics, _deltaTime: number, _supportInfo: CharacterSurfaceInfo): Vector3 {
        return Vector3.Zero();
    }
}