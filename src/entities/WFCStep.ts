export enum WFCStepType {
  CALCULATE_ENTROPY = 'CALCULATE_ENTROPY',
  COLLAPSE_WITH_MIN_ENTROPY = 'COLLAPSE_WITH_MIN_ENTROPY'
}

export class WFCStep {
  private constructor(
    readonly type: WFCStepType,
    readonly name: string,
    readonly x?: number,
    readonly y?: number
  ) { }

  static CollapseWithMinEntropy(): WFCStep {
    return new WFCStep(WFCStepType.COLLAPSE_WITH_MIN_ENTROPY, 'Collapse min');
  }

  static CalculateEntropy(x: number, y: number): WFCStep {
    return new WFCStep(WFCStepType.CALCULATE_ENTROPY, `Calculate entropy [${x}, ${y}]`, x, y);
  }
}
