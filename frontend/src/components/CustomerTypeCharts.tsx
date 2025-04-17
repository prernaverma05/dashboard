import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledBackdrop = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  zIndex: 1000,
});

interface CustomerTypeData {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Cust_Type?: string;
}

interface ChartProps {
  data: CustomerTypeData[];
}

interface ProcessedData {
  quarter: string;
  existing: number;
  new: number;
  total: number;
}

interface DialogState {
  open: boolean;
  type: string;
  data: CustomerTypeData[];
  color: string;
}

const CustomerTypeCharts: React.FC<ChartProps> = ({ data }) => {
  const barChartRef = useRef<SVGSVGElement | null>(null);
  const donutChartRef = useRef<SVGSVGElement | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    type: '',
    data: [],
    color: ''
  });

  const handleClose = () => {
    setDialogState(prev => ({ ...prev, open: false }));
  };

  const handleTypeClick = (type: string, color: string) => {
    const typeData = data.filter(d => d.Cust_Type === type);
    setDialogState({
      open: true,
      type,
      data: typeData,
      color
    });
  };

  useEffect(() => {
    if (!data.length) return;

    const quarterlyData = d3.group(data, d => d.closed_fiscal_quarter);
    const processedData: ProcessedData[] = [];
    
    const sortedQuarters = Array.from(quarterlyData.keys()).sort();
    
    sortedQuarters.forEach(quarter => {
      const quarterData = quarterlyData.get(quarter) || [];
      const existing = quarterData.find(v => v.Cust_Type === 'Existing Customer')?.acv || 0;
      const newCust = quarterData.find(v => v.Cust_Type === 'New Customer')?.acv || 0;
      
      processedData.push({
        quarter,
        existing,
        new: newCust,
        total: existing + newCust
      });
    });

    const totalExisting = d3.sum(data.filter(d => d.Cust_Type === 'Existing Customer'), d => d.acv);
    const totalNew = d3.sum(data.filter(d => d.Cust_Type === 'New Customer'), d => d.acv);

    renderBarChart(processedData);
    renderDonutChart([
      { type: 'Existing Customer', value: totalExisting },
      { type: 'New Customer', value: totalNew }
    ]);
  }, [data]);

  const renderBarChart = (processedData: ProcessedData[]) => {
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(barChartRef.current).selectAll('*').remove();

    const svg = d3.select(barChartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(processedData.map(d => d.quarter))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.total) || 0])
      .range([height, 0]);

    const stack = d3.stack<ProcessedData>()
      .keys(['existing', 'new'] as const)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(processedData);

    const color = d3.scaleOrdinal<string>()
      .domain(['existing', 'new'])
      .range(['#2196f3', '#ff9800']);

    const layers = svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', d => color(d.key));

    layers.selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => x(d.data.quarter) || 0)
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

    layers.selectAll('text')
      .data(d => d)
      .join('text')
      .attr('x', d => (x(d.data.quarter) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d[1]) + (y(d[0]) - y(d[1])) / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .style('font-size', '12px')
      .text(d => {
        const value = d[1] - d[0];
        return `$${d3.format('.0f')(value / 1000)}K`;
      });

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d => `$${d3.format('.0f')(Number(d) / 1000)}K`));

    const legend = svg.append('g')
      .attr('transform', `translate(${width - 100}, 0)`);

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#2196f3');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text('Existing');

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 25)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#ff9800');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 37)
      .text('New');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Won ACV mix by Customer Type');
  };

  const renderDonutChart = (data: { type: string; value: number }[]) => {
    const width = 250;
    const height = 250;
    const radius = Math.min(width, height) / 2;

    d3.select(donutChartRef.current).selectAll('*').remove();

    const svg = d3.select(donutChartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(['Existing Customer', 'New Customer'])
      .range(['#2196f3', '#ff9800']);

    const pie = d3.pie<{ type: string; value: number }>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<{ type: string; value: number }>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('d', d => arc(d) || '')
      .attr('fill', d => color(d.data.type))
      .style('cursor', 'pointer')
      .on('click', (event, d) => handleTypeClick(d.data.type, color(d.data.type)));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => `${d3.format('.1%')(d.data.value / d3.sum(data, d => d.value))}`);

    const legend = svg.append('g')
      .attr('transform', `translate(${radius + 10},-${radius})`);

    data.forEach((d, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(d.type));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(`${d.type} (${d3.format('.1%')(d.value / d3.sum(data, d => d.value))})`);
    });

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '16px')
      .text(`Total\n$${d3.format('.0f')(d3.sum(data, d => d.value) / 1000)}K`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, position: 'relative' }}>
      <svg ref={barChartRef}></svg>
      <svg ref={donutChartRef}></svg>

      {dialogState.open && <StyledBackdrop onClick={handleClose} />}
      
      <Dialog 
        open={dialogState.open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            zIndex: 1100,
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            m: 0, 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: dialogState.color,
            color: 'white'
          }}
        >
          <Typography variant="h6" component="div">
            {`${dialogState.type} Details`}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: dialogState.color, opacity: 0.8 }}>
                  <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Fiscal Quarter</TableCell>
                  <TableCell sx={{ color: 'black', fontWeight: 'bold' }} align="right">Count</TableCell>
                  <TableCell sx={{ color: 'black', fontWeight: 'bold' }} align="right">ACV ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dialogState.data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.closed_fiscal_quarter}
                    </TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                    <TableCell align="right">
                      ${d3.format(',.2f')(row.acv)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomerTypeCharts;