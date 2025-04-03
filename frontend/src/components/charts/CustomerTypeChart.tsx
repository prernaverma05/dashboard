import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Customer } from '../../types';

interface CustomerTypeChartProps {
  data: Customer[];
}

const CustomerTypeChart: React.FC<CustomerTypeChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Prepare data
    const typeCount = data.reduce((acc, customer) => {
      acc[customer.type] = (acc[customer.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
    }));

    // Set dimensions
    const width = 400;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create pie chart
    const pie = d3.pie<any>().value((d: any) => d.count);
    const arc = d3.arc<any>()
      .innerRadius(radius * 0.5) // Create a donut chart
      .outerRadius(radius);

    // Add slices
    const slices = svg
      .selectAll('path')
      .data(pie(chartData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => color(d.data.type))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Add labels
    const labelArc = d3.arc<any>()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    svg
      .selectAll('text')
      .data(pie(chartData))
      .enter()
      .append('text')
      .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d: any) => `${d.data.type} (${d.data.count})`);

    // Add hover effects
    slices
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', (d: any) => {
            const [x, y] = arc.centroid(d);
            return `translate(${x * 0.1}, ${y * 0.1})`;
          });
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'translate(0, 0)');
      });

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default CustomerTypeChart; 