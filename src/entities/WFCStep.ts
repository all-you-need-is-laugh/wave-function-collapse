export enum WFCStepType {
  CALCULATE_ENTROPY = 'CALCULATE_ENTROPY',
  COLLAPSE = 'COLLAPSE',
  PICK_WITH_MIN_ENTROPY = 'PICK_WITH_MIN_ENTROPY',
}

export class WFCStep {
  private constructor(
    readonly type: WFCStepType,
    readonly name: string,
    readonly x?: number,
    readonly y?: number,
  ) {}

  static PickWithMinEntropy(): WFCStep {
    return new WFCStep(WFCStepType.PICK_WITH_MIN_ENTROPY, 'Pick');
  }

  static CalculateEntropy(x: number, y: number): WFCStep {
    return new WFCStep(WFCStepType.CALCULATE_ENTROPY, `Calculate entropy [${x}, ${y}]`, x, y);
  }

  static Collapse(x: number, y: number): WFCStep {
    return new WFCStep(WFCStepType.COLLAPSE, `Collapse [${x}, ${y}]`, x, y);
  }
}
