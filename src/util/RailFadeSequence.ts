import {
    AbstractMesh,
    ActionManager,
    Effect,
    ExecuteCodeAction,
    Mesh,
    PostProcess,
    Scene,
    UniversalCamera,
    Vector3,
} from "@babylonjs/core";
import { Player } from "../Entities/Player";
import { GameContext } from "../util/GameContext";
import {SceneManager} from "../Scenes/SceneManager";
import {AsyncScene} from "../Scenes/AsyncScene";

export interface RailFadeSequenceParams {
    /** Mesh qui déclenche la séquence au passage du joueur */
    startTrigger: AbstractMesh;
    /** Mesh qui définit la fin du trajet (fadeAlpha atteint 1 quand le joueur y arrive) */
    endPlane: AbstractMesh;
    /** Hauteur fixe de la rail camera au-dessus du joueur */
    railHeight?: number;
    /** Recul fixe de la rail camera derrière le joueur (sur Z) */
    railZOffset?: number;
}

/**
 * Encapsule le comportement :
 *   1. Le joueur traverse `startTrigger`
 *   2. La caméra bascule sur une UniversalCamera qui suit le joueur sur Z uniquement
 *   3. Un fade noir progressif s'applique entre startTrigger.z et endPlane.z
 *   4. Quand fadeAlpha == 1, on demande au SceneManager de passer à nextScene
 *
 * Usage :
 *   // Dans start() de votre scène, après avoir créé le joueur :
 *   this.railFade_ = new RailFadeSequence(scene, sceneManager, nextScene, player, gameContext, {
 *       startTrigger: this.myStartMesh,
 *       endPlane:     this.myEndMesh,
 *   });
 *
 *   // Dans update() :
 *   this.railFade_.update();
 */
export class RailFadeSequence {
    // ── Params ────────────────────────────────────────────────────────────────
    private readonly scene_: Scene;
    private readonly sceneManager_: SceneManager;
    private readonly nextScene_: AsyncScene;
    private readonly player_: Player;
    private readonly startTrigger_: AbstractMesh;
    private readonly endPlane_: AbstractMesh;
    private readonly railHeight_: number;
    private readonly railZOffset_: number;

    // ── State ─────────────────────────────────────────────────────────────────
    private triggered_: boolean = false;
    private fadeAlpha_: number = 0;

    // ── BabylonJS objects ─────────────────────────────────────────────────────
    private railCamera_: UniversalCamera;
    private fadePostProcess_: PostProcess;
    private gameContext_: GameContext;

    constructor(
        scene: Scene,
        sceneManager: SceneManager,
        nextScene: AsyncScene,
        player: Player,
        gameContext: GameContext,
        params: RailFadeSequenceParams
    ) {
        this.scene_        = scene;
        this.sceneManager_ = sceneManager;
        this.nextScene_    = nextScene;
        this.player_       = player;
        this.gameContext_  = gameContext;
        this.startTrigger_ = params.startTrigger;
        this.endPlane_     = params.endPlane;
        this.railHeight_   = params.railHeight  ?? 8;
        this.railZOffset_  = params.railZOffset ?? -6;

        this.registerShader_();
        this.buildRailCamera_();
        this.registerStartTrigger_();
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /** À appeler dans update() de la scène parente. */
    update(): void {
        if (!this.triggered_) return;
        this.updateRailCamera_();
        this.updateFade_();
    }

    /** Permet de savoir si la séquence a déjà été déclenchée. */
    get isTriggered(): boolean {
        return this.triggered_;
    }

    /** Valeur courante du fade (0 = transparent, 1 = noir total). */
    get fadeAlpha(): number {
        return this.fadeAlpha_;
    }

    // ── Initialisation privée ─────────────────────────────────────────────────

    /**
     * Enregistre le shader une seule fois dans le ShadersStore global.
     * Si la scène parente le fait déjà, ce double enregistrement est inoffensif
     * car BabylonJS écrase simplement l'entrée.
     */
    private registerShader_(): void {
        Effect.ShadersStore["fadeFragmentShader"] = `
            precision highp float;
            varying vec2 vUV;
            uniform sampler2D textureSampler;
            uniform float fadeAlpha;

            void main(void) {
                vec4 color = texture2D(textureSampler, vUV);
                gl_FragColor = mix(color, vec4(0.0, 0.0, 0.0, 1.0), fadeAlpha);
            }
        `;
    }

    private buildRailCamera_(): void {
        this.railCamera_ = new UniversalCamera(
            "rail_fade_camera",
            new Vector3(0, this.railHeight_, this.railZOffset_),
            this.scene_
        );
        this.railCamera_.setTarget(new Vector3(0, 0, 1000));
        this.railCamera_.minZ = 0.1;

        this.fadePostProcess_ = new PostProcess(
            "railFadeEffect",
            "fade",
            ["fadeAlpha"],
            null,
            1.0,
            this.railCamera_
        );
        this.fadePostProcess_.onApply = (effect) => {
            effect.setFloat("fadeAlpha", this.fadeAlpha_);
        };
    }

    private registerStartTrigger_(): void {
        const playerMesh = this.player_.getCollider();

        this.startTrigger_.actionManager = new ActionManager(this.scene_);
        this.startTrigger_.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: { mesh: playerMesh },
                },
                () => {
                    this.triggered_ = true;
                    this.activateRailCamera_();
                    console.log("[RailFadeSequence] start trigger traversé");
                }
            )
        );
    }

    // ── Logique privée ────────────────────────────────────────────────────────

    private activateRailCamera_(): void {
        const pos = this.player_.getCollider().position;
        this.railCamera_.position = new Vector3(
            pos.x,
            pos.y + this.railHeight_,
            pos.z + this.railZOffset_
        );
        this.gameContext_.playerCamera.alpha = 4.71; //TODO hardcodé...
        this.scene_.activeCamera = this.railCamera_;
    }

    private updateRailCamera_(): void {
        const pos = this.player_.getCollider().position;
        this.railCamera_.position.z = pos.z + this.railZOffset_;
        this.railCamera_.setTarget(new Vector3(0, pos.y, pos.z));
    }

    private updateFade_(): void {
        const playerZ = this.player_.getCollider().position.z;
        const startZ  = this.startTrigger_.position.z;
        const endZ    = this.endPlane_.position.z;

        const raw = (playerZ - startZ) / (endZ - startZ);
        this.fadeAlpha_ = Math.min(1, Math.max(0, raw));

        if (this.fadeAlpha_ >= 1) {
            this.sceneManager_.switchTo(this.nextScene_, false);
        }
    }
}
