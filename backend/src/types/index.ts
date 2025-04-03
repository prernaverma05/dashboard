/**
 * Backend Type Definitions
 * 
 * Central type definitions for the backend API.
 * Defines the shape of data structures used across the application.
 */

/**
 * ACV Range data structure
 * Represents Annual Contract Value range distribution
 */
export interface ACVRange {
  count: number;                  // Number of customers in range
  acv: number;                   // Total ACV for the range
  closed_fiscal_quarter: string; // Fiscal quarter
  ACV_Range: string;            // Range category
}

/**
 * Customer Type data structure
 * Represents customer type distribution
 */
export interface CustomerType {
  count: number;                  // Number of customers
  acv: number;                   // Total ACV
  closed_fiscal_quarter: string; // Fiscal quarter
  Cust_Type: string;            // Customer type (New/Existing)
}

/**
 * Industry data structure
 * Represents industry distribution
 */
export interface Industry {
  count: number;                  // Number of customers
  acv: number;                   // Total ACV
  closed_fiscal_quarter: string; // Fiscal quarter
  Acct_Industry: string;        // Industry name
  query_key?: string;           // Optional query key
}

/**
 * Team data structure
 * Represents team performance metrics
 */
export interface Team {
  count: number;                  // Number of deals
  acv: number;                   // Total ACV
  closed_fiscal_quarter: string; // Fiscal quarter
  Team: string;                 // Team name
} 