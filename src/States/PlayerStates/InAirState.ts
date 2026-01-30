import {PlayerState} from "./PlayerState";
import {CharacterSupportedState, Vector3} from "@babylonjs/core";
import {OnGroundState} from "./OnGroundState";

export class InAirState extends PlayerState {
    getNextState(support: CharacterSupportedState, _wantToJump: boolean): PlayerState {
        if (support == CharacterSupportedState.SUPPORTED) {
            return new OnGroundState();
        }
        return this;
    }

    public getDesiredVelocity(): Vector3 {
        throw new Error("Method not implemented.");
    }
}