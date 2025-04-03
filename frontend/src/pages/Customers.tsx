import React from 'react';
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
} from '@mui/material';
import { CustomerType } from '../types';

const Customers: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = React.useState('2024-Q2');
  const quarters = ['2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2'];

  // Mock data - replace with actual API calls
  const customerTypes: CustomerType[] = [
    { count: 23, acv: 647821.48, closed_fiscal_quarter: '2024-Q2', Cust_Type: 'Existing Customer' },
    { count: 6, acv: 224643.3, closed_fiscal_quarter: '2024-Q2', Cust_Type: 'New Customer' },
    { count: 51, acv: 1360047.16, closed_fiscal_quarter: '2024-Q1', Cust_Type: 'Existing Customer' },
    { count: 6, acv: 313189.25, closed_fiscal_quarter: '2024-Q1', Cust_Type: 'New Customer' },
  ];

  const filteredData = customerTypes.filter(d => d.closed_fiscal_quarter === selectedQuarter);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Customer Types</Typography>
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Type</TableCell>
              <TableCell align="right">Count</TableCell>
              <TableCell align="right">ACV</TableCell>
              <TableCell align="right">Average ACV</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((type) => (
              <TableRow key={type.Cust_Type}>
                <TableCell>{type.Cust_Type}</TableCell>
                <TableCell align="right">{type.count}</TableCell>
                <TableCell align="right">${type.acv.toLocaleString()}</TableCell>
                <TableCell align="right">
                  ${(type.acv / type.count).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Customers; 