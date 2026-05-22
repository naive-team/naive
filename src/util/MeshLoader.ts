import {Scene, AbstractMesh, Vector3, ImportMeshAsync, ISceneLoaderAsyncResult} from "@babylonjs/core";

export class MeshLoader {

    public static async loadMesh(file: string, scene: Scene) {
        const result: ISceneLoaderAsyncResult = await ImportMeshAsync(file, scene);

        const mesh: AbstractMesh = result.meshes[0];
        mesh.rotationQuaternion = null;
        mesh.position = Vector3.Zero();

        return {mesh: mesh, animationGroups: result.animationGroups}
    }
}