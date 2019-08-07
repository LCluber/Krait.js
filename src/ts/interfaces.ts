import { Input } from "./input";

export interface CtrlKeys {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

export interface Keys {
  [key: number]: Input;
}
