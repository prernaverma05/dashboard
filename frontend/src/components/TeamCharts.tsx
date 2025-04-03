import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';

interface TeamData {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Team?: string;
}

interface ChartProps {
  data: TeamData[];
}

interface ProcessedData {
  quarter: string;
  [key: string]: number | string; // Dynamic keys for different teams
}

const TeamCharts: React.FC<ChartProps> = ({ data }) => {
  const barChartRef = useRef<SVGSVGElement | null>(null);
  const donutChartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    // Process data for visualization
    const quarterlyData = d3.group(data, d => d.closed_fiscal_quarter);
    const processedData: ProcessedData[] = [];
    const teams = Array.from(new Set(data.map(d => d.Team || ''))).sort();
    
    // Sort quarters for consistent ordering
    const sortedQuarters = Array.from(quarterlyData.keys()).sort();
    
    sortedQuarters.forEach(quarter => {
      const quarterData = quarterlyData.get(quarter) || [];
      const dataPoint: ProcessedData = { quarter };
      let total = 0;
      
      teams.forEach(team => {
        const value = quarterData.find(v => v.Team === team)?.acv || 0;
        dataPoint[team] = value;
        total += value;
      });
      
      dataPoint.total = total;
      processedData.push(dataPoint);
    });

    // Calculate totals for donut chart
    const teamTotals = teams.map(team => ({
      type: team,
      value: d3.sum(data.filter(d => d.Team === team), d => d.acv)
    }));

    renderBarChart(processedData, teams);
    renderDonutChart(teamTotals);
  }, [data]);

  const renderBarChart = (processedData: ProcessedData[], teams: string[]) => {
    const margin = { top: 20, right: 150, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(barChartRef.current).selectAll('*').remove();

    const svg = d3.select(barChartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(processedData.map(d => d.quarter))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.total as number) || 0])
      .range([height, 0]);

    // Stack the data
    const stack = d3.stack<ProcessedData>()
      .keys(teams)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(processedData);

    // Color scale
    const color = d3.scaleOrdinal<string>()
      .domain(teams)
      .range(d3.schemeCategory10);

    // Add bars
    const layers = svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', d => color(d.key));

    // Add bar rectangles
    layers.selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => x(d.data.quarter as string) || 0)
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

    // Add value labels inside bars
    layers.selectAll('text')
      .data(d => d)
      .join('text')
      .attr('x', d => (x(d.data.quarter as string) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d[1]) + (y(d[0]) - y(d[1])) / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .style('font-size', '12px')
      .text(d => {
        const value = d[1] - d[0];
        return value > 0 ? `$${d3.format('.0f')(value / 1000)}K` : '';
      });

    // Add axes
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

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 10}, 0)`);

    teams.forEach((team, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(team));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(team);
    });

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Won ACV by Team');
  };

  const renderDonutChart = (data: { type: string; value: number }[]) => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Clear previous chart
    d3.select(donutChartRef.current).selectAll('*').remove();

    const svg = d3.select(donutChartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.type))
      .range(d3.schemeCategory10);

    const pie = d3.pie<{ type: string; value: number }>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<{ type: string; value: number }>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    // Add the arcs
    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('d', d => arc(d) || '')
      .attr('fill', d => color(d.data.type));

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => `${d3.format('.1%')(d.data.value / d3.sum(data, d => d.value))}`);

    // Add legend
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

    // Add center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '16px')
      .text(`Total\n$${d3.format('.0f')(d3.sum(data, d => d.value) / 1000)}K`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg ref={barChartRef}></svg>
      <svg ref={donutChartRef}></svg>
    </Box>
  );
};

export default TeamCharts; 