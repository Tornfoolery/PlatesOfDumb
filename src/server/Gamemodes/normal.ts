import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Settings } from "shared/settings";

const Assets = ReplicatedStorage.WaitForChild("TS").WaitForChild("Assets")
const Plate_Template = Assets.FindFirstChild("DefaultPlate") as BasePart;

export function GeneratePlates(StartPosition: Vector3) {
    for (let x = 0; x < Settings.MaxXPlates; x++) {
        const XPosition = StartPosition.X + x * Settings.PlateOffset;
        for (let z = 0; z < Settings.MaxZPlates; z++) {
            const ZPosition = StartPosition.Z + z * Settings.PlateOffset;

            const Plate = Plate_Template.Clone();
            Plate.Position = new Vector3(XPosition, StartPosition.Y, ZPosition);
            Plate.Parent = Workspace;
        }
    }
}