import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { api } from '../services/api';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CustomerTypeCharts from '../components/CustomerTypeCharts';
import TeamCharts from '../components/TeamCharts';
import IndustryCharts from '../components/IndustryCharts';
import ACVRangeCharts from '../components/ACVRangeCharts';

type DataType = 'acv-range' | 'customer-type' | 'industries' | 'teams';

interface DataItem {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Team?: string;
  Cust_Type?: string;
  Acct_Industry?: string;
  ACV_Range?: string;
  [key: string]: any; // For any other properties
}

const Dashboard: React.FC = () => {
  const [selectedDataType, setSelectedDataType] = useState<DataType>('teams');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DataItem[]>([]);

  const dataTypes = [
    { value: 'teams', label: 'Teams' },
    { value: 'customer-type', label: 'Customer Type' },
    { value: 'industries', label: 'Industries' },
    { value: 'acv-range', label: 'ACV Range' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let result;
        switch (selectedDataType) {
          case 'acv-range':
            result = await api.getACVRanges();
            break;
          case 'customer-type':
            result = await api.getCustomerTypes();
            break;
          case 'industries':
            result = await api.getIndustries();
            break;
          case 'teams':
            result = await api.getTeams();
            break;
        }
        setData(result);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDataType]);

  const totalCustomers = data.reduce((sum, item) => sum + item.count, 0);
  const totalACV = data.reduce((sum, item) => sum + item.acv, 0);
  const averageACV = totalCustomers > 0 ? totalACV / totalCustomers : 0;

  const getColumnName = () => {
    switch (selectedDataType) {
      case 'acv-range':
        return 'ACV Range';
      case 'customer-type':
        return 'Customer Type';
      case 'industries':
        return 'Industry';
      case 'teams':
        return 'Team';
      default:
        return 'Name';
    }
  };

  const getValue = (item: DataItem) => {
    switch (selectedDataType) {
      case 'acv-range':
        return item.ACV_Range;
      case 'customer-type':
        return item.Cust_Type;
      case 'industries':
        return item.Acct_Industry;
      case 'teams':
        return item.Team;
      default:
        return '';
    }
  };

  const renderCustomerTypeTable = (data: DataItem[]) => {
    // Get unique quarters and sort them
    const quarters = Array.from(new Set(data.map(d => d.closed_fiscal_quarter))).sort();
    
    // Group data by customer type
    const customerTypes = ['Existing Customer', 'New Customer'];
    const groupedData = new Map<string, Map<string, { acv: number, count: number }>>();
    
    customerTypes.forEach(type => {
      const quarterMap = new Map<string, { acv: number, count: number }>();
      quarters.forEach(quarter => {
        const entry = data.find(d => d.Cust_Type === type && d.closed_fiscal_quarter === quarter);
        quarterMap.set(quarter, { 
          acv: entry?.acv || 0,
          count: entry?.count || 0
        });
      });
      groupedData.set(type, quarterMap);
    });

    // Calculate totals
    const quarterTotals = quarters.map(quarter => {
      const quarterData = data.filter(d => d.closed_fiscal_quarter === quarter);
      const total = {
        acv: quarterData.reduce((sum, item) => sum + item.acv, 0),
        count: quarterData.reduce((sum, item) => sum + item.count, 0)
      };
      return { quarter, ...total };
    });

    const grandTotal = {
      acv: quarterTotals.reduce((sum, qt) => sum + qt.acv, 0),
      count: quarterTotals.reduce((sum, qt) => sum + qt.count, 0)
    };

    return (
      <TableContainer component={Paper} sx={{ mt: 4, width: '100%', overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>Cust Type</TableCell>
              {quarters.map(quarter => (
                <TableCell key={quarter} colSpan={3} align="center" sx={{ width: '25%' }}>
                  {quarter}
                </TableCell>
              ))}
              <TableCell colSpan={3} align="center" sx={{ width: '25%' }}>Total</TableCell>
            </TableRow>
            <TableRow>
              {quarters.map(quarter => (
                <React.Fragment key={quarter}>
                  <TableCell align="right" sx={{ width: '8%' }}># of Opps</TableCell>
                  <TableCell align="right" sx={{ width: '10%' }}>ACV</TableCell>
                  <TableCell align="right" sx={{ width: '7%' }}>% of Total</TableCell>
                </React.Fragment>
              ))}
              <TableCell align="right" sx={{ width: '8%' }}># of Opps</TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>ACV</TableCell>
              <TableCell align="right" sx={{ width: '7%' }}>% of Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerTypes.map(type => {
              const typeData = groupedData.get(type)!;
              const typeTotal = {
                acv: quarters.reduce((sum, q) => sum + (typeData.get(q)?.acv || 0), 0),
                count: quarters.reduce((sum, q) => sum + (typeData.get(q)?.count || 0), 0)
              };
              
              return (
                <TableRow key={type}>
                  <TableCell>{type}</TableCell>
                  {quarters.map(quarter => {
                    const data = typeData.get(quarter) || { acv: 0, count: 0 };
                    const quarterTotal = quarterTotals.find(qt => qt.quarter === quarter)!;
                    const percentage = quarterTotal.acv > 0 ? (data.acv / quarterTotal.acv * 100) : 0;
                    
                    return (
                      <React.Fragment key={quarter}>
                        <TableCell align="right">{data.count}</TableCell>
                        <TableCell align="right">
                          ${data.acv.toLocaleString()}<br />
                          <Typography variant="caption" color="textSecondary">
                            {percentage.toFixed(1)}%
                          </Typography>
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                  <TableCell align="right">{typeTotal.count}</TableCell>
                  <TableCell align="right">
                    ${typeTotal.acv.toLocaleString()}<br />
                    <Typography variant="caption" color="textSecondary">
                      {((typeTotal.acv / grandTotal.acv) * 100).toFixed(1)}%
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              {quarterTotals.map(({ quarter, acv, count }) => (
                <React.Fragment key={quarter}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{count}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    ${acv.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                </React.Fragment>
              ))}
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{grandTotal.count}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                ${grandTotal.acv.toLocaleString()}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTeamTable = (data: DataItem[]) => {
    const quarters = Array.from(new Set(data.map(d => d.closed_fiscal_quarter))).sort();
    const teams = Array.from(new Set(data.map(d => d.Team || ''))).sort();
    const groupedData = new Map<string, Map<string, { acv: number, count: number }>>();
    
    teams.forEach(team => {
      const quarterMap = new Map<string, { acv: number, count: number }>();
      quarters.forEach(quarter => {
        const entry = data.find(d => d.Team === team && d.closed_fiscal_quarter === quarter);
        quarterMap.set(quarter, { 
          acv: entry?.acv || 0,
          count: entry?.count || 0
        });
      });
      groupedData.set(team, quarterMap);
    });

    const quarterTotals = quarters.map(quarter => {
      const quarterData = data.filter(d => d.closed_fiscal_quarter === quarter);
      const total = {
        acv: quarterData.reduce((sum, item) => sum + item.acv, 0),
        count: quarterData.reduce((sum, item) => sum + item.count, 0)
      };
      return { quarter, ...total };
    });

    const grandTotal = {
      acv: quarterTotals.reduce((sum, qt) => sum + qt.acv, 0),
      count: quarterTotals.reduce((sum, qt) => sum + qt.count, 0)
    };

    return (
      <TableContainer component={Paper} sx={{ mt: 4, width: '100%', overflowX: 'auto' }}>
        <Table 
          sx={{ 
            tableLayout: 'fixed',
            '& .MuiTableCell-root': {
              fontSize: '0.75rem',
              padding: '6px 3px',
              borderRight: '1px solid rgba(224, 224, 224, 0.4)',
              textAlign: 'center',
            },
            '& .MuiTableCell-root:last-child': {
              borderRight: 'none',
            },
            '& .number-cell': {
              fontFamily: 'monospace',
              letterSpacing: '-0.5px',
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '12%' }}>Team</TableCell>
              {quarters.map(quarter => (
                <TableCell 
                  key={quarter} 
                  colSpan={3} 
                  align="center" 
                  sx={{ width: '17.6%' }}
                >
                  {quarter}
                </TableCell>
              ))}
              <TableCell 
                colSpan={3} 
                align="center" 
                sx={{ width: '17.6%' }}
              >
                Total
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              {[...quarters, 'Total'].map(period => (
                <React.Fragment key={period}>
                  <TableCell 
                    align="center" 
                    sx={{ width: '4.8%' }}
                  >
                    # of Opps
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ width: '8%' }}
                  >
                    ACV
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ width: '4.8%' }}
                  >
                    % of Total
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map(team => {
              const teamData = groupedData.get(team)!;
              const teamTotal = {
                acv: quarters.reduce((sum, q) => sum + (teamData.get(q)?.acv || 0), 0),
                count: quarters.reduce((sum, q) => sum + (teamData.get(q)?.count || 0), 0)
              };
              
              return (
                <TableRow key={team}>
                  <TableCell sx={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    textAlign: 'left'
                  }}>
                    {team}
                  </TableCell>
                  {quarters.map(quarter => {
                    const data = teamData.get(quarter) || { acv: 0, count: 0 };
                    const quarterTotal = quarterTotals.find(qt => qt.quarter === quarter)!;
                    const percentage = quarterTotal.acv > 0 ? (data.acv / quarterTotal.acv * 100) : 0;
                    
                    return (
                      <React.Fragment key={quarter}>
                        <TableCell align="center" className="number-cell">
                          {data.count}
                        </TableCell>
                        <TableCell 
                          align="center" 
                          className="number-cell"
                          sx={{ 
                            whiteSpace: 'nowrap',
                            fontSize: '0.7rem'
                          }}
                        >
                          ${data.acv.toLocaleString()}
                        </TableCell>
                        <TableCell align="center" className="number-cell">
                          {percentage.toFixed(1)}%
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                  <TableCell align="center" className="number-cell">
                    {teamTotal.count}
                  </TableCell>
                  <TableCell 
                    align="center" 
                    className="number-cell"
                    sx={{ 
                      whiteSpace: 'nowrap',
                      fontSize: '0.7rem'
                    }}
                  >
                    ${teamTotal.acv.toLocaleString()}
                  </TableCell>
                  <TableCell align="center" className="number-cell">
                    {((teamTotal.acv / grandTotal.acv) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'left' }}>Total</TableCell>
              {quarterTotals.map(({ quarter, acv, count }) => (
                <React.Fragment key={quarter}>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }} className="number-cell">
                    {count}
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontWeight: 'bold', 
                      whiteSpace: 'nowrap',
                      fontSize: '0.7rem'
                    }} 
                    className="number-cell"
                  >
                    ${acv.toLocaleString()}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }} className="number-cell">
                    100%
                  </TableCell>
                </React.Fragment>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold' }} className="number-cell">
                {grandTotal.count}
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 'bold', 
                  whiteSpace: 'nowrap',
                  fontSize: '0.7rem'
                }} 
                className="number-cell"
              >
                ${grandTotal.acv.toLocaleString()}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }} className="number-cell">
                100%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderIndustryTable = (data: DataItem[]) => {
    const quarters = Array.from(new Set(data.map(d => d.closed_fiscal_quarter))).sort();
    const industries = Array.from(new Set(data.map(d => d.Acct_Industry || ''))).sort();
    const groupedData = new Map<string, Map<string, { acv: number, count: number }>>();
    
    industries.forEach(industry => {
      const quarterMap = new Map<string, { acv: number, count: number }>();
      quarters.forEach(quarter => {
        const entry = data.find(d => d.Acct_Industry === industry && d.closed_fiscal_quarter === quarter);
        quarterMap.set(quarter, { 
          acv: entry?.acv || 0,
          count: entry?.count || 0
        });
      });
      groupedData.set(industry, quarterMap);
    });

    const quarterTotals = quarters.map(quarter => {
      const quarterData = data.filter(d => d.closed_fiscal_quarter === quarter);
      const total = {
        acv: quarterData.reduce((sum, item) => sum + item.acv, 0),
        count: quarterData.reduce((sum, item) => sum + item.count, 0)
      };
      return { quarter, ...total };
    });

    const grandTotal = {
      acv: quarterTotals.reduce((sum, qt) => sum + qt.acv, 0),
      count: quarterTotals.reduce((sum, qt) => sum + qt.count, 0)
    };

    return (
      <TableContainer component={Paper} sx={{ mt: 4, width: '100%', overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>Industry</TableCell>
              {quarters.map(quarter => (
                <TableCell key={quarter} colSpan={3} align="center" sx={{ width: '25%' }}>
                  {quarter}
                </TableCell>
              ))}
              <TableCell colSpan={3} align="center" sx={{ width: '25%' }}>Total</TableCell>
            </TableRow>
            <TableRow>
              {quarters.map(quarter => (
                <React.Fragment key={quarter}>
                  <TableCell align="right" sx={{ width: '8%' }}># of Opps</TableCell>
                  <TableCell align="right" sx={{ width: '10%' }}>ACV</TableCell>
                  <TableCell align="right" sx={{ width: '7%' }}>% of Total</TableCell>
                </React.Fragment>
              ))}
              <TableCell align="right" sx={{ width: '8%' }}># of Opps</TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>ACV</TableCell>
              <TableCell align="right" sx={{ width: '7%' }}>% of Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {industries.map(industry => {
              const industryData = groupedData.get(industry)!;
              const industryTotal = {
                acv: quarters.reduce((sum, q) => sum + (industryData.get(q)?.acv || 0), 0),
                count: quarters.reduce((sum, q) => sum + (industryData.get(q)?.count || 0), 0)
              };
              
              return (
                <TableRow key={industry}>
                  <TableCell>{industry}</TableCell>
                  {quarters.map(quarter => {
                    const data = industryData.get(quarter) || { acv: 0, count: 0 };
                    const quarterTotal = quarterTotals.find(qt => qt.quarter === quarter)!;
                    const percentage = quarterTotal.acv > 0 ? (data.acv / quarterTotal.acv * 100) : 0;
                    
                    return (
                      <React.Fragment key={quarter}>
                        <TableCell align="right">{data.count}</TableCell>
                        <TableCell align="right">${data.acv.toLocaleString()}</TableCell>
                        <TableCell align="right">{percentage.toFixed(1)}%</TableCell>
                      </React.Fragment>
                    );
                  })}
                  <TableCell align="right">{industryTotal.count}</TableCell>
                  <TableCell align="right">${industryTotal.acv.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    {((industryTotal.acv / grandTotal.acv) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              {quarterTotals.map(({ quarter, acv, count }) => (
                <React.Fragment key={quarter}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{count}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    ${acv.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                </React.Fragment>
              ))}
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{grandTotal.count}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                ${grandTotal.acv.toLocaleString()}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderACVRangeTable = (data: DataItem[]) => {
    const quarters = Array.from(new Set(data.map(d => d.closed_fiscal_quarter))).sort();
    const ranges = Array.from(new Set(data.map(d => d.ACV_Range || ''))).sort((a, b) => {
      // Custom sorting for ACV ranges
      const getMinValue = (range: string) => {
        const match = range.match(/\$(\d+)K/);
        return match ? parseInt(match[1]) : 0;
      };
      return getMinValue(a) - getMinValue(b);
    });
    
    const groupedData = new Map<string, Map<string, { acv: number, count: number }>>();
    
    ranges.forEach(range => {
      const quarterMap = new Map<string, { acv: number, count: number }>();
      quarters.forEach(quarter => {
        const entry = data.find(d => d.ACV_Range === range && d.closed_fiscal_quarter === quarter);
        quarterMap.set(quarter, { 
          acv: entry?.acv || 0,
          count: entry?.count || 0
        });
      });
      groupedData.set(range, quarterMap);
    });

    const quarterTotals = quarters.map(quarter => {
      const quarterData = data.filter(d => d.closed_fiscal_quarter === quarter);
      const total = {
        acv: quarterData.reduce((sum, item) => sum + item.acv, 0),
        count: quarterData.reduce((sum, item) => sum + item.count, 0)
      };
      return { quarter, ...total };
    });

    const grandTotal = {
      acv: quarterTotals.reduce((sum, qt) => sum + qt.acv, 0),
      count: quarterTotals.reduce((sum, qt) => sum + qt.count, 0)
    };

    return (
      <TableContainer component={Paper} sx={{ mt: 4, width: '100%', overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>ACV Range</TableCell>
              {quarters.map(quarter => (
                <TableCell key={quarter} colSpan={3} align="center" sx={{ width: '25%' }}>
                  {quarter}
                </TableCell>
              ))}
              <TableCell colSpan={3} align="center" sx={{ width: '25%' }}>Total</TableCell>
            </TableRow>
            <TableRow>
              {quarters.map(quarter => (
                <React.Fragment key={quarter}>
                  <TableCell align="right" sx={{ width: '8%' }}># of Opps</TableCell>
                  <TableCell align="right" sx={{ width: '10%' }}>ACV</TableCell>
                  <TableCell align="right" sx={{ width: '7%' }}>% of Total</TableCell>
                </React.Fragment>
              ))}
              <TableCell align="right" sx={{ width: '8%' }}># of Opps</TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>ACV</TableCell>
              <TableCell align="right" sx={{ width: '7%' }}>% of Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranges.map(range => {
              const rangeData = groupedData.get(range)!;
              const rangeTotal = {
                acv: quarters.reduce((sum, q) => sum + (rangeData.get(q)?.acv || 0), 0),
                count: quarters.reduce((sum, q) => sum + (rangeData.get(q)?.count || 0), 0)
              };
              
              return (
                <TableRow key={range}>
                  <TableCell>{range}</TableCell>
                  {quarters.map(quarter => {
                    const data = rangeData.get(quarter) || { acv: 0, count: 0 };
                    const quarterTotal = quarterTotals.find(qt => qt.quarter === quarter)!;
                    const percentage = quarterTotal.acv > 0 ? (data.acv / quarterTotal.acv * 100) : 0;
                    
                    return (
                      <React.Fragment key={quarter}>
                        <TableCell align="right">{data.count}</TableCell>
                        <TableCell align="right">${data.acv.toLocaleString()}</TableCell>
                        <TableCell align="right">{percentage.toFixed(1)}%</TableCell>
                      </React.Fragment>
                    );
                  })}
                  <TableCell align="right">{rangeTotal.count}</TableCell>
                  <TableCell align="right">${rangeTotal.acv.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    {((rangeTotal.acv / grandTotal.acv) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              {quarterTotals.map(({ quarter, acv, count }) => (
                <React.Fragment key={quarter}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{count}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    ${acv.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                </React.Fragment>
              ))}
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{grandTotal.count}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                ${grandTotal.acv.toLocaleString()}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

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
        <Typography variant="h4">Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Data Type</InputLabel>
            <Select
              value={selectedDataType}
              label="Data Type"
              onChange={(e) => setSelectedDataType(e.target.value as DataType)}
            >
              {dataTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {/* <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Customers</Typography>
              </Box>
              <Typography variant="h4">{totalCustomers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalanceIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total ACV</Typography>
              </Box>
              <Typography variant="h4">${totalACV.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Average ACV</Typography>
              </Box>
              <Typography variant="h4">${averageACV.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}
      {selectedDataType === 'customer-type' && (
        <>
          <Box sx={{ mb: 4 }}>
            <CustomerTypeCharts data={data} />
          </Box>
          {renderCustomerTypeTable(data)}
        </>
      )}
      {selectedDataType === 'teams' && (
        <>
          <Box sx={{ mb: 4 }}>
            <TeamCharts data={data} />
          </Box>
          {renderTeamTable(data)}
        </>
      )}
      {selectedDataType === 'industries' && (
        <>
          <Box sx={{ mb: 4 }}>
            <IndustryCharts data={data} />
          </Box>
          {renderIndustryTable(data)}
        </>
      )}
      {selectedDataType === 'acv-range' && (
        <>
          <Box sx={{ mb: 4 }}>
            <ACVRangeCharts data={data} />
          </Box>
          {renderACVRangeTable(data)}
        </>
      )}
    </Box>
  );
};

export default Dashboard;