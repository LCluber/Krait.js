import { Input } from "./input";

export interface CtrlKeys {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  [key: string]: boolean | undefined;
}

export interface DefaultInputs {
  ctrlKeys: CtrlKeys;
  asciiCodes: number[];
}

export interface Keys {
  [key: number]: Input;
}
