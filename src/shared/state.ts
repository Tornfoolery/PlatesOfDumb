let PlayersInGame: number = 0;
let CurrentStatus: string = "WaitingForPlayers";

export const UpdatePlayersInGame = (Num: number) => PlayersInGame = Num;
export const GetPlayersInGame = () => PlayersInGame;

export const UpdateStatus = (Str: string) => CurrentStatus = Str;
export const GetStatus = () => CurrentStatus;