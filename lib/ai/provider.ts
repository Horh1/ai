export type LeadAnalysis = {
  score: number;
  priority: "low" | "medium" | "high";
  intent: string;
  customer_type: string;
  estimated_value: "low" | "medium" | "high";
  summary: string;
  signals: string[];
};

export interface AIProvider {
  analyzeLead(input: {
    message: string;
    companyContext?: string;
  }): Promise<LeadAnalysis>;

  generateReply(input: {
    message: string;
    companyContext?: string;
    tone?: string;
  }): Promise<string>;
}