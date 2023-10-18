import {
  OnChanges,
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit
} from "@angular/core";
import TreeChart from "d3-org-chart";
import * as d3 from 'd3';
import { CompanyHierarchyViewDto } from "src/app/_models/employes";

@Component({
  selector: "app-d3-org-chart",
  templateUrl: "./d3-org-chart.component.html",
  styleUrls: ["./d3-org-chart.component.scss"]
})
export class D3OrgChartComponent implements OnChanges {
  @ViewChild("chartContainer") chartContainer: ElementRef;
  @Input() data: any[];
  chart;
  stratifiedData: any;

  constructor(private el: ElementRef) { }


  ngOnChanges() {
    console.log(this.data);
    const width = 800;
    const height = 400;
    const svg = d3.select(this.el.nativeElement).append('svg')
      .attr('width', width)
      .attr('height', height);

    const nodes = this.data.map(d => ({
      id: d.roleId,
      name: d.roleName,
      level: d.hierarchyLevel
    }));
    console.log(nodes);

    const links = this.data.map(d => ({
      source: d.selfId,
      target: d.roleId
    }));
    console.log(links);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));
    console.log(simulation);

    const link = svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link');
    console.log(link);

    const node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    console.log(node);

    node.append('title')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    if (this.data && this.data.length > 0) {
      // Filter data to exclude nodes with selfId !== null
      const filteredData = this.data.filter(item => item.selfId === null);
      console.log(filteredData);

      if (filteredData.length === 0) {
        console.error('No root node found.');
        return;
      }

      const rootNode = filteredData[0];
      console.log(rootNode);

      this.stratifiedData = d3.stratify<CompanyHierarchyViewDto>()
        .id(d => d.chartId.toString())
        .parentId(d => d.selfId ? d.selfId.toString() : rootNode.chartId.toString())
        (this.data);
      console.log(this.stratifiedData);

      // Initialize the chart here
      if (!this.chart) {
        this.chart = new TreeChart();
      }
      this.chart
        .container('chartContainer')
        .data(this.stratifiedData)
        .svgWidth(500)
        .initialZoom(0.4)
        .onNodeClick(d => console.log(d + " node clicked"))
        .render();
    }
  }
}
