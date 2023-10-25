import {
    OnChanges,
    Component,
    Input,
    ViewChild,
    ElementRef,
    OnInit
} from "@angular/core";
import TreeChart from "d3-org-chart";
//import * as d3 from 'd3';
// import { CompanyHierarchyViewDto } from "src/app/_models/employes";
import * as d3 from "d3";
import { EmployeeService } from "src/app/_services/employee.service";
import { CompanyHierarchyViewDto } from "src/app/_models/employes";


export class nodeBorderColor {
    red: number = 255;
    green: number = 130;
    blue: number = 14;
    alpha: number = 1;
};
export class nodeBackgroundColor {
    red: number = 51;
    green: number = 182;
    blue: number = 208;
    alpha: number = 1;
};
export class nodeImageBorderColor {
    red: number = 19;
    green: number = 123;
    blue: number = 128;
    alpha: number = 1
};

export class nodeImage {
    url: string = "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/female.jpg";
    width: number = 100;
    height: number = 100;
    centerTopDistance: number = 0;
    centerLeftDistance: number = 0;
    cornerShape: string = "ROUNDED";
    shadow: boolean = false;
    borderWidth: number = 0;
    borderColor: nodeImageBorderColor;
}

export class connectorLine {
    red: number = 220;
    green: number = 189;
    blue: number = 207;
    alpha: number = 1
}

export class nodeIcon {
    icon: string = null;
    size: number = 10;
}
//"https://to.ly/1yZnX";
//30
export class NodeItem {
    nodeId?: string;
    parentNodeId?: string;
    width: number = 511;
    height: number = 284;
    left: number = 300;
    borderWidth: number = 1;
    borderRadius: number = 5;
    borderColor: nodeBorderColor = new nodeBorderColor();
    backgroundColor: nodeBorderColor = new nodeBorderColor();
    nodeImage: nodeImage = new nodeImage();
    nodeIcon: nodeIcon = new nodeIcon();
    template: string;
    connectorLineColor: connectorLine = new connectorLine();
    connectorLineWidth: number = 8;
    dashArray: string = "";
    expanded: boolean = true;
    directSubordinates: number;
    totalSubordinates: number;
}
@Component({
    selector: "app-d3-org-chart",
    templateUrl: "./d3-org-chart.component.html",
    styleUrls: ["./d3-org-chart.component.scss"]
})
export class D3OrgChartComponent implements OnChanges, OnInit {
    @ViewChild("chartContainer") chartContainer: ElementRef;
    data: any[] = null;
    chart: TreeChart;
    templateEmployee: string = '<div><div style="margin-left:70px; margin-top:10px; font-size:20pt; font-weight:bold;">NAME</div><div style="margin-left:70px; margin-top:3px;font-size:16pt;">DESIGNATION </div> <div style="margin-left:70px;margin-top:3px;font-size:14pt;">PROJECT</div></div>';
    templateOrg:string = '<div><div style="margin-left:70px; margin-top:10px; font-size:20pt; font-weight:bold;"> NAME </div> </div>';
    reName = /NAME/g;
    reDesignation = /DESIGNATION/g;
    reProject = /PROJECT/g;
    constructor(private employeeService: EmployeeService,) { }



    ngOnInit() {
        this.employeeService.getCompanyHierarchy().subscribe((resp) => {
            let data = resp as unknown as CompanyHierarchyViewDto[];
            if (this.data == null) this.data = [];

            data.forEach(org => {
                let item: NodeItem = new NodeItem()

                item.nodeId = `0-${org.chartId}`
                if (org.selfId)
                    item.parentNodeId = `0-${org.selfId}`
                else item.parentNodeId = null

                item.directSubordinates = data.filter(d => d.selfId == org.chartId).length
                item.totalSubordinates = data.filter(d => d.hierarchyLevel > org.hierarchyLevel).length
                item.template = this.templateOrg.replace(this.reName, org.roleName);

                this.data.push(item)
            });

            console.log(this.data);
            this.updateChart();
        });
    }

    ngAfterViewInit() {
        if (!this.chart) {
            this.chart = new TreeChart();
        }
        this.updateChart();
    }

    ngOnChanges() {
        this.updateChart();
    }
    updateChart() {
        if (!this.data || this.data.length == 0) {
            return;
        }
        if (!this.chart) {
            return;
        }
        console.log(this.data);
        // this.data = d3.json(this.data)
        this.chart
            .container(this.chartContainer.nativeElement)
            .data(this.data)
        //     .rootMargin(100)
        //   .nodeWidth((d) => 210)
        //   .nodeHeight((d) => 140)
        //   .childrenMargin((d) => 130)
        //   .compactMarginBetween((d) => 75)
        //   .compactMarginPair((d) => 80)
            .svgWidth(500)
            .initialZoom(0.4)
            .onNodeClick(d => console.log(d + ' node clicked'))
            .render();
    }

    // diagonal = d3.svg.diagonal().projection((d: any) => {
    //     // return [d.x + this.rectW / 2, d.y + this.rectH / 2];
    //     return [d.y, d.x];
    // });


    // // A recursive helper function for performing some setup by walking through all nodes
    // public visit = (parent: any, visitFn: any, childrenFn: any): void => {
    //     if (typeof childrenFn !== 'function') {
    //         //default childrenFn =
    //         childrenFn = function (node) {
    //             return node.children || null;
    //         };
    //     }
    //     if (!parent) {
    //         return;
    //     }
    //     visitFn(parent);
    //     var children = childrenFn(parent);
    //     if (children) {
    //         for (var i = 0, count = children.length; i < count; i++) {
    //             this.visit(children[i], visitFn, childrenFn);
    //         }
    //     }
    // }

    // getNodes() {


    //             // this._nodeDataService.root = data;
    //             // debugger;
    //             this.data.x0 = 0;
    //             this.data.y0 = this.height / 2;
    //             console.log("height", this.height);

    //             this.collapse = (d: any) => {
    //                 if (d.children) {
    //                     d._children = d.children;
    //                     d._children.forEach(this.collapse);
    //                     d.children = null;
    //                 }
    //             };
    //             this.data.children.forEach(this.collapse);


    //             this.update(this.data);
    //             // Call visit function to establish maxLabelLength
    //             this.visit(this.data, (d: any) => {
    //                 let totalNodes: number = 0;
    //                 totalNodes++;
    //                 this.maxLabelLength = Math.max(d.name.length, this.maxLabelLength);

    //             }, (d: any) => {
    //                 return d.children && d.children.length > 0 ? d.children : null;
    //             });
    // };

    // //necessary so that zoom knows where to zoom and unzoom from
    // // zm.translate([350, 20]);

    // selectFrame = d3.select(self.frameElement).style("height", "800px");

    // update = (source: any) => {
    //     let i: number = 0;
    //     // Compute the new tree layout.
    //     let nodes = this.tree.nodes(this.data).reverse(),
    //         links = this.tree.links(nodes);
    //     // Normalize for fixed-depth.
    //     nodes.forEach((n: any) => {
    //         n.y = n.depth * 180;
    //     });

    //     // Update the nodes…
    //     let node = this.svg.selectAll("g.node")
    //         .data(nodes, function (n: any) {
    //             return n.size || (n.id = ++i);
    //         }

    //         );

    //     // Enter any new nodes at the parent's previous position.
    //     let nodeEnter = node.enter().append("g")
    //         .attr("class", "node")
    //         .attr("transform", (n: any) => {

    //             return "translate(" + source.y0 + "," + source.x0 + ")";
    //         })

    //         .on("click", this.click);

    //     nodeEnter.append("rect")
    //         .attr("width", this.rectW)
    //         .attr("height", this.rectH)
    //         .attr("stroke", "black")
    //         .attr("stroke-width", 1)
    //         .style("fill", (d) => {
    //             return d._children ? "lightsteelblue" : "#fff";
    //         });

    //     nodeEnter.append("text")
    //         .attr("x", this.rectW / 2)
    //         .attr("y", this.rectH / 2)
    //         .attr("dy", ".35em")
    //         .attr("text-anchor", "middle")
    //         .text((d: any) => {
    //             return d.name;
    //         });

    //     // Transition nodes to their new position.
    //     let nodeUpdate = node.transition()
    //         .duration(this.duration)
    //         .attr("transform", (d: any) => {
    //             return "translate(" + d.y + "," + d.x + ")";
    //         });

    //     nodeUpdate.select("rect")
    //         .attr("width", this.rectW)
    //         .attr("height", this.rectH)
    //         .attr("stroke", "black")
    //         .attr("stroke-width", 1)
    //         .style("fill", (d: any) => {
    //             return d._children ? "lightsteelblue" : "#fff";
    //         });

    //     nodeUpdate.select("text")
    //         .style("fill-opacity", 1);

    //     // Transition exiting nodes to the parent's new position.
    //     let nodeExit = node.exit().transition()
    //         .duration(this.duration)
    //         .attr("transform", (n: any) => {
    //             return "translate(" + source.y + "," + source.x + ")";
    //         })
    //         .remove();

    //     nodeExit.select("rect")
    //         .attr("width", this.rectW)
    //         .attr("height", this.rectH)
    //         //.attr("width", bbox.getBBox().width)""
    //         //.attr("height", bbox.getBBox().height)
    //         .attr("stroke", "black")
    //         .attr("stroke-width", 1);

    //     nodeExit.select("text");

    //     // Update the links…
    //     var link = this.svg.selectAll("path.link")
    //         .data(links, function (n: any) {
    //             return n.target.id;
    //         });

    //     // Enter any new links at the parent's previous position.
    //     // Enter any new links at the parent's previous position.
    //     link.enter().insert("path", "g")
    //         .attr("class", "link")
    //         .attr("x", this.rectW / 2)
    //         .attr("y", this.rectH / 2)
    //         .attr("d", (d) => {
    //             var o = {
    //                 x: source.x0,
    //                 y: source.y0
    //             };
    //             return this.diagonal({
    //                 source: o,
    //                 target: o
    //             });
    //         });

    //     // Transition links to their new position.
    //     link.transition()
    //         .duration(this.duration)
    //         .attr("d", this.diagonal);

    //     // Transition exiting nodes to the parent's new position.
    //     link.exit().transition()
    //         .duration(this.duration)
    //         .attr("d", (n: any) => {
    //             var o = {
    //                 x: source.x,
    //                 y: source.y
    //             }
    //             return this.diagonal({
    //                 source: o,
    //                 target: o
    //             });
    //         })

    //     // Stash the old positions for transition.
    //     nodes.forEach((n: any) => {
    //         n.x0 = n.x;
    //         n.y0 = n.y;
    //     });

    // };
    // click = (d): void => {
    //     if (d.children) {
    //         d._children = d.children;
    //         d.children = null;
    //     } else {
    //         d.children = d._children;
    //         d._children = null;
    //     }
    //     this.update(d);
    // };

    // redraw = (d) => {
    //     this.svg.attr("transform",
    //         "translate(" + d3.event.translate + ")"
    //         + " scale(" + d3.event.scale + ")");
    // }
}


//debugger
// console.log(this.data);
// const width = 800;
// const height = 400;
// const svg = d3.select(this.el.nativeElement).append('svg')
//     .attr('width', width)
//     .attr('height', height);

// const nodes = this.data.map(d => ({
//     id: d.roleId,
//     name: d.roleName,
//     level: d.hierarchyLevel
// }));
// console.log(nodes);

// const links = this.data.map(d => ({
//     source: d.selfId,
//     target: d.roleId
// }));
// console.log(links);

// const simulation = d3.forceSimulation(nodes)
//     .force('link', d3.forceLink(links).id(d => d.id))
//     .force('charge', d3.forceManyBody())
//     .force('center', d3.forceCenter(width / 2, height / 2));
// console.log(simulation);

// const link = svg.selectAll('.link')
//     .data(links)
//     .enter().append('line')
//     .attr('class', 'link');
// console.log(link);

// const node = svg.selectAll('.node')
//     .data(nodes)
//     .enter().append('circle')
//     .attr('class', 'node')
//     .attr('r', 10)
//     .call(d3.drag()
//         .on('start', dragstarted)
//         .on('drag', dragged)
//         .on('end', dragended));
// console.log(node);

// node.append('title')
//     .text(d => d.name);

// simulation.on('tick', () => {
//     link
//         .attr('x1', d => d.source.x)
//         .attr('y1', d => d.source.y)
//         .attr('x2', d => d.target.x)
//         .attr('y2', d => d.target.y);

//     node
//         .attr('cx', d => d.x)
//         .attr('cy', d => d.y);
// });

// function dragstarted(event, d) {
//     if (!event.active) simulation.alphaTarget(0.3).restart();
//     d.fx = d.x;
//     d.fy = d.y;
// }

// function dragged(event, d) {
//     d.fx = event.x;
//     d.fy = event.y;
// }

// function dragended(event, d) {
//     if (!event.active) simulation.alphaTarget(0);
//     d.fx = null;
//     d.fy = null;
// }

// if (this.data && this.data.length > 0) {
//     // Filter data to exclude nodes with selfId !== null
//     const filteredData = this.data.filter(item => item.selfId === null);
//     console.log(filteredData);

//     if (filteredData.length === 0) {
//         console.error('No root node found.');
//         return;
//     }

//     const rootNode = filteredData[0];
//     console.log(rootNode);

//     this.stratifiedData = d3.stratify<CompanyHierarchyViewDto>()
//         .id(d => d.chartId.toString())
//         .parentId(d => d.selfId ? d.selfId.toString() : rootNode.chartId.toString())
//         (this.data);
//     console.log(this.stratifiedData);

//     // Initialize the chart here
//     if (!this.chart) {
//         this.chart = new TreeChart();
//     }
//     this.chart
//         .container('chartContainer')
//         .data(this.stratifiedData)
//         .svgWidth(500)
//         .initialZoom(0.4)
//         .onNodeClick(d => console.log(d + " node clicked"))
//         .render();
// }
