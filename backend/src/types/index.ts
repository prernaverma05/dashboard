export interface ACVRange {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  ACV_Range: string;
}

export interface CustomerType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Cust_Type: string;
}

export interface Industry {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Acct_Industry: string;
  query_key?: string;
}

export interface Team {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Team: string;
} 