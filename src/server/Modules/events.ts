import Signal from "@rbxts/signal";

export module SignalEvents {
    export const GameStart = new Signal();
    export const PlayersUpdate = new Signal<(NumPlayers: number) => void>();
}