import { ReplicatedStorage, Workspace, Players, RunService } from "@rbxts/services";

// Player References
const Player = Players.LocalPlayer;
const PlayerUI = Player.WaitForChild("PlayerGui");

const Mouse = Player.GetMouse();

// UIS
const MainUI = PlayerUI.WaitForChild("MainUI") as ScreenGui;
const Header = MainUI.FindFirstChild("Header") as Frame;
const TextLabel = Header.FindFirstChild("TextLabel") as TextLabel;

// Global Values
import * as GlobalValues from "shared/GlobalValuesHandler";

const RoundInformation = GlobalValues.getConfig("RoundInfo");
RoundInformation?.getUpdated("Timer").Connect(() => {
  const TimerValue = RoundInformation?.get("Timer") as Number;
  const Message = RoundInformation?.get("Message") as string;

  const FormattedMessage = Message.format(tostring(TimerValue));
  TextLabel.Text = FormattedMessage;
})

RoundInformation?.getUpdated("Message").Connect(() => {
  const TimerValue = RoundInformation?.get("Timer") as Number;
  const Message = RoundInformation?.get("Message") as string;

  const FormattedMessage = TimerValue && TimerValue !== 0 ? Message.format(tostring(TimerValue)) : Message;
  TextLabel.Text = FormattedMessage;
})

// Player Hover
const Assets = ReplicatedStorage.WaitForChild("TS").WaitForChild("Assets");
const PlateHoverBillboardUI = Assets.FindFirstChild("PlateHoverBillboardUI") as BillboardGui;

let LastHoverPart: BasePart | undefined;
let LastHoverUI: BillboardGui | undefined;

function ClearLastHover() {
  LastHoverUI?.Destroy();
  LastHoverPart = undefined;
}

RunService.RenderStepped.Connect(() => {
  const Plate = Mouse.Target as BasePart || undefined;
  if (Plate) {
    const Folder = Plate.FindFirstAncestorOfClass("Folder") as Folder;

    if (Folder && Folder.Name === "Plates") {
      if (LastHoverPart !== Plate) {
        ClearLastHover()

        const Model = Plate.Parent as Model
        const PlateOwner = Model.GetAttribute("Player") || "Noone";
  
        const HoverBillboard = PlateHoverBillboardUI.Clone();
        const Label = HoverBillboard.FindFirstChild("Label") as TextLabel;
        Label.Text = `${PlateOwner}'s Plate`;
    
        HoverBillboard.Adornee = Plate;
        HoverBillboard.Parent = Plate;
    
        LastHoverPart = Plate;
        LastHoverUI = HoverBillboard;
      }
    } else { ClearLastHover() }
  } else { ClearLastHover() }
})