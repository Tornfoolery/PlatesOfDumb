import { ReplicatedStorage } from "@rbxts/services";

// Variables
const existing: { [key: string]: Config } = {};

const globalValues =
  ReplicatedStorage.FindFirstChild("Global_Values") ||
  (new Instance("Folder") as Folder);
globalValues.Parent = ReplicatedStorage;
globalValues.Name = "Global_Values";

export const globalFolder = globalValues;

export const getConfig = (Name: string): Config | undefined => {
  const Existed = existing[Name];
  if (Existed) {
    return Existed;
  }

  const ConfigClass = new Config(Name);
  existing[Name] = ConfigClass;
  return existing[Name];
};

export class Config {
  public Instance: Instance;

  public constructor(Name: string) {
    this.Instance =
      globalValues.FindFirstChild(Name) || new Instance("Configuration");
    this.Instance.Name = Name;
    this.Instance.Parent = globalValues;
    existing[Name] = this;
  }

  public get(SpecificValue: string) {
    if (SpecificValue !== undefined) {
      return this.Instance.GetAttribute(SpecificValue);
    } else {
      return this.Instance.GetAttributes();
    }
  }

  public set(Name: string, Value: AttributeValue) {
    this.Instance.SetAttribute(Name, Value);
  }
}
