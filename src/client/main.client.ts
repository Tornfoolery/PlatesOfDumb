import { Players, RunService } from "@rbxts/services";

// Instance References
const LocalPlayer = Players.LocalPlayer;
const PlayerUI = LocalPlayer.WaitForChild("PlayerGui");

const MainUI = PlayerUI.WaitForChild("MainUI") as ScreenGui;
const Header = MainUI.FindFirstChild("Header") as Frame;
const TextLabel = Header.FindFirstChild("TextLabel") as TextLabel;

// Global Values
import * as GlobalValues from "shared/GlobalValuesHandler";

const roundInformation = GlobalValues.getConfig("RoundInfo");
roundInformation?.getUpdated("Timer").Connect(() => {
  const TimerValue = roundInformation?.get("Timer") as Number;
  const Message = roundInformation?.get("Message") as string;

  const FormattedMessage = Message.format(tostring(TimerValue));
  TextLabel.Text = FormattedMessage;
})

roundInformation?.getUpdated("Message").Connect(() => {
  const TimerValue = roundInformation?.get("Timer") as Number;
  const Message = roundInformation?.get("Message") as string;

  const FormattedMessage = TimerValue && TimerValue !== 0 ? Message.format(tostring(TimerValue)) : Message;
  TextLabel.Text = FormattedMessage;
})
