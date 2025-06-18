export enum CommandEnum {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface MissionControlInterface {
  run: () => Promise<void>;
}
