import { EtatRover } from "@model";

export interface MapInterface {
  mapUpdate: (etatRover: EtatRover) => void;
  mapDisplay: () => void
}