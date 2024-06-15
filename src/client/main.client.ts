import { Players } from "@rbxts/services";

// Instance References
const LocalPlayer = Players.LocalPlayer;
const PlayerUI = LocalPlayer.WaitForChild('PlayerGui')

const MainUI = PlayerUI.WaitForChild("MainUI") as ScreenGui;
const Header = MainUI.FindFirstChild("Header") as Frame;
const TextLabel = Header.FindFirstChild("TextLabel") as TextLabel;

// Events