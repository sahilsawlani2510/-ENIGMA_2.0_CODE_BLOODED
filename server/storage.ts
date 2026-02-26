import { type SimulationState, type InsertSimulationState } from "@shared/schema";

export interface IStorage {
  getSimulationState(): Promise<SimulationState>;
}

export class MemStorage implements IStorage {
  private state: SimulationState;

  constructor() {
    this.state = {
      id: 1,
      greenCover: 0,
      floodActive: false,
      healthScore: 100,
    };
  }

  async getSimulationState(): Promise<SimulationState> {
    return this.state;
  }
}

export const storage = new MemStorage();
