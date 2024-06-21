import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Settings } from "shared/settings";

const Assets = ReplicatedStorage.WaitForChild("TS").WaitForChild("Assets");
const Plate_Template = Assets.FindFirstChild("DefaultPlate") as Model;

const Plates: { [ID: string]: { ID: string; Model: Model, Part: BasePart } } = {};
const PlateIDs: string[] = [];

export function GeneratePlates(PlatesFolder: Folder) {
  const StartPosition: Vector3 = Settings.StartPosition;
  for (let x = 0; x < Settings.MaxXPlates; x++) {
    const XPosition = StartPosition.X + x * Settings.PlateOffset;
    for (let z = 0; z < Settings.MaxZPlates; z++) {
      const ZPosition = StartPosition.Z + z * Settings.PlateOffset;

      const Model = Plate_Template.Clone();
      const Plate = Model.PrimaryPart as BasePart;
      Plate.Position = new Vector3(XPosition, StartPosition.Y, ZPosition);
      Model.Parent = PlatesFolder;

      const ID = `X${x}Z${z}`;
      Model.SetAttribute("ID", ID);
      Model.SetAttribute("Player", false);

      Plates[ID] = { ID: ID, Model: Model, Part: Plate };
      PlateIDs.push(ID);
    }
  }
}

export function AssignPlayers(PlayersInGame: Player[]) {
  for (const Player of PlayersInGame) {
    const Character = Player.Character
    if (Character) {
      let Plate: { ID: string; Model: Model, Part: BasePart };
      do {
        const RandomID = PlateIDs[math.random(0, PlateIDs.size() - 1)];
        Plate = Plates[RandomID];
      } while (Plate.Model.GetAttribute("Player") !== false);

      Plate.Model.SetAttribute("Player", Player.Name);

      const HumRP = Character.FindFirstChild("HumanoidRootPart") as BasePart;
      const PlateCFrame = Plate.Part.CFrame
      const SpawnOffset = Settings.SpawnOffset
      HumRP.CFrame = PlateCFrame.mul(SpawnOffset);
    }
  }
}