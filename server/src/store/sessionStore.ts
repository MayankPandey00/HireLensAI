import { ResumeRealityCheck, AssessmentBundle, PlacementReadinessReport } from '../types/schema';

class SessionStore {
  private realityChecks = new Map<string, ResumeRealityCheck>();
  private assessments = new Map<string, AssessmentBundle>();
  private reports = new Map<string, PlacementReadinessReport>();

  setRealityCheck(id: string, data: ResumeRealityCheck) {
    this.realityChecks.set(id, data);
  }

  getRealityCheck(id: string): ResumeRealityCheck | undefined {
    return this.realityChecks.get(id);
  }

  setAssessment(id: string, data: AssessmentBundle) {
    this.assessments.set(id, data);
  }

  getAssessment(id: string): AssessmentBundle | undefined {
    return this.assessments.get(id);
  }

  setReport(id: string, data: PlacementReadinessReport) {
    this.reports.set(id, data);
  }

  getReport(id: string): PlacementReadinessReport | undefined {
    return this.reports.get(id);
  }
}

export const sessionStore = new SessionStore();
