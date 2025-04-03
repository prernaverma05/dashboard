/**
 * Global Type Definitions
 * 
 * Central repository for all TypeScript interfaces and types used across the application.
 * Defines the shape of data structures used in the dashboard.
 */

/**
 * Customer entity interface
 * Represents a customer record in the system
 */
export interface Customer {
  id: string;           // Unique identifier
  name: string;         // Customer name
  type: string;         // Customer type (New/Existing)
  industry: string;     // Industry sector
  acvRange: string;     // ACV range category
  revenue: number;      // Customer revenue
  teamId: string;       // Associated team ID
}

/**
 * Team member interface
 * Represents an individual team member with performance metrics
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  performance: {
    revenue: number;    // Revenue generated
    customers: number;  // Number of customers
    deals: number;      // Number of deals closed
  };
}

export interface Team {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Team: string;
}

export interface Industry {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Acct_Industry: string;
  query_key?: string;
}

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