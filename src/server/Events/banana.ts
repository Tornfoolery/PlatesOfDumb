import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Settings } from "shared/settings";

const Assets = ReplicatedStorage.WaitForChild("TS").WaitForChild("Assets");
const Items = Assets.FindFirstChild("Items") as Folder;
const BananaPeelTemplate = Items.FindFirstChild("BananaPeel") as BasePart;

const Folder = Workspace.FindFirstChild("EventItems");

class Banana {
  public TouchDebounce = false;

  private Instance: BasePart;

  public constructor(Model: Model) {
    const Plate = Model.FindFirstChild("Plate") as BasePart;
    const Pos = Plate.Position;
    const Size = Plate.Size;

    this.Instance = BananaPeelTemplate.Clone();
    this.Instance.Position =  new Vector3(Pos.X + math.random(-Size.X / 2, Size.X / 2), Pos.Y + 5, Pos.Z + math.random(-Size.Z / 2, Size.Z / 2));
    this.Instance.Parent = Folder;

    const SlipSound = this.Instance.FindFirstChild("SlipSound") as Sound;

    this.Instance.Touched.Connect((Hit) => {
      if (this.TouchDebounce === false) {
        this.TouchDebounce = true;

        const Humanoid = Hit.Parent?.FindFirstChild("Humanoid") as Humanoid;
        if (Humanoid) {
          SlipSound.Play();
          Humanoid.Sit = true;
          Humanoid.Jump = true;
          task.wait(1);
          Humanoid.Sit = false;
        }

        this.TouchDebounce = false;
      }
    });

    this.Instance.Destroying.Connect(() => {
      this.Delete();
    });
  }

  public Delete() {
    this.Instance.Destroy();
  }
}

export const EventMessage = "%s have been banana!";

export function AffectPlate(Model: Model) {
  new Banana(Model);
}