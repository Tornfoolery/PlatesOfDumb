import { Players, Workspace } from "@rbxts/services";
import * as GlobalValues from "shared/GlobalValuesHandler";

const EventItems = new Instance("Folder");
EventItems.Name = "EventItems";
EventItems.Parent = Workspace;

import * as Banana from "server/Events/banana";

const RoundInformation = new GlobalValues.Config('RoundInfo')

const Events = [Banana];

interface EventModule {
    AffectPlate: (Model: Model) => void;
    EventMessage: string,
}

export async function RandomEventModule(): Promise<EventModule> {
    const Module = Events[math.random(0, Events.size() - 1)];
    return Module as EventModule;
}

export async function AffectRandomPlate(Plates: { [ID: string]: { ID: string; Model: Model; Part: BasePart } }, PlateIDs: string[], Count: number) {
    const PlateCount = PlateIDs.size();
    const Module = await RandomEventModule();

    const PlatesAffected: Model[] = [];
    const PlateOwners: string[] = [];

    for (let i = 0; i < Count; i++) {
        const RandomID = PlateIDs[math.random(0, PlateCount - 1)];
        const Model = Plates[RandomID].Model;
        PlatesAffected.push(Model);
        PlateOwners.push(Model.GetAttribute("Player") as string || "Noone");
    }

    RoundInformation.set("Message", `${Module.EventMessage.format(PlateOwners.join("'s, ") + "'s Plate")}`);

    for (const Model of PlatesAffected) {
        AffectPlate(Model, Module);
    }
}

export function AffectPlate(Model: Model, Module: EventModule) {
    Module.AffectPlate(Model);
}
