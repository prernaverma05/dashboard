/**
 * Industries Page Component
 * 
 * Displays industry-wise distribution of customers and revenue.
 * Shows performance metrics across different industry sectors.
 * 
 * Features:
 * - Quarter-based filtering
 * - Industry-wise metrics
 * - Performance comparison
 * - Interactive data visualization
 * - Loading and error states
 */

import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Industry } from '../types';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { api } from '../services/api';

/**
 * Main Industries page component
 * Manages industry data and visualization
 */
const IndustriesPage: React.FC = () => {
  // State management
  const [selectedQuarter, setSelectedQuarter] = useState('2024-Q2');
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const quarters = ['2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2'];

  /**
   * Fetches industry data on component mount
   * Updates state with fetched data or error message
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getIndustries();
        setIndustries(data);
      } catch (err) {
        setError('Failed to fetch Industry data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = industries.filter(d => d.closed_fiscal_quarter === selectedQuarter);
  
  const totalCustomers = filteredData.reduce((sum, industry) => sum + industry.count, 0);
  const totalACV = filteredData.reduce((sum, industry) => sum + industry.acv, 0);
  const averageACV = totalCustomers > 0 ? totalACV / totalCustomers : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Industry Performance</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Fiscal Quarter</InputLabel>
          <Select
            value={selectedQuarter}
            label="Fiscal Quarter"
            onChange={(e) => setSelectedQuarter(e.target.value)}
          >
            {quarters.map((quarter) => (
              <MenuItem key={quarter} value={quarter}>
                {quarter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#333333'}}>Total Customers</Typography>
              </Box>
              <Typography variant="h4" sx={{ marginLeft: '27px'}}>{totalCustomers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalanceIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#333333'}}>Total ACV</Typography>
              </Box>
              <Typography variant="h4" sx={{ marginLeft: '27px'}}>${totalACV.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#333333'}}>Average ACV</Typography>
              </Box>
              <Typography variant="h4" sx={{ marginLeft: '27px'}}>${averageACV.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div className="table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="column-large">Industry</TableCell>
                <TableCell className="column-small number-cell">Customers</TableCell>
                <TableCell className="column-large number-cell">ACV</TableCell>
                <TableCell className="column-large number-cell">Average ACV</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((industry) => (
                <TableRow key={industry.Acct_Industry}>
                  <TableCell className="column-large">{industry.Acct_Industry}</TableCell>
                  <TableCell className="column-small number-cell">{industry.count}</TableCell>
                  <TableCell className="column-large number-cell">${industry.acv.toLocaleString()}</TableCell>
                  <TableCell className="column-large number-cell">
                    ${(industry.acv / industry.count).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default IndustriesPage; 