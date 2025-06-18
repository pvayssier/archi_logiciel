import { RoverOrientation } from './RoverOrientation';

export interface EtatRover {
  position: { x: number; y: number };
  orientation: RoverOrientation;
  successed: boolean;
}
