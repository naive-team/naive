import {SoundScreenState} from "../GameStates/SoundScreenState";
import {CharacterSupportedState, Vector3} from "@babylonjs/core";

export abstract class PlayerState {

    public abstract getNextState(support: CharacterSupportedState, wantToJump : boolean) : PlayerState;

    public abstract getDesiredVelocity() : Vector3;
}