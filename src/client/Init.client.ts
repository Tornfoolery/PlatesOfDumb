import { Players, RunService } from "@rbxts/services";

// UI

// Instance References
const Player = Players.LocalPlayer;
const PlayerUI = Player.WaitForChild('PlayerGui')
const PlayerScripts = Player.WaitForChild('PlayerScripts')

// Folders
const StarterGuiFolder = PlayerScripts.FindFirstChild('StarterGui', true) as Instance;

StarterGuiFolder.GetChildren().forEach( (Instance: Instance, Index: number) => {
    Instance.Parent = PlayerUI;
});