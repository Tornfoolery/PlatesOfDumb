import { Players } from "@rbxts/services";

// UI

// Instance References
const LocalPlayer = Players.LocalPlayer;
const PlayerUI = LocalPlayer.WaitForChild('PlayerGui')
const PlayerScripts = LocalPlayer.WaitForChild('PlayerScripts')

// Folders
const StarterGuiFolder = PlayerScripts.FindFirstChild('StarterGui', true) as Instance;

StarterGuiFolder.GetChildren().forEach( (Instance: Instance, Index: number) => {
    Instance.Parent = PlayerUI;
});