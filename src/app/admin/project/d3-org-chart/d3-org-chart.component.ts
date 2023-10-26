import {
    OnChanges,
    Component,
    Input,
    ViewChild,
    ElementRef,
    OnInit
} from "@angular/core";
//import TreeChart from "d3-org-chart";
//declare var OrgChart: any;
import * as d3 from 'd3';

import { OrgChart } from "./orgChart";
import { EmployeeService } from "src/app/_services/employee.service";
import { CompanyHierarchyViewDto } from "src/app/_models/employes";
import { jsPDF } from "jspdf";
import { Observable, Subscription } from "rxjs";
/*
  "d3": "7.6.1",
    "d3-flextree": "2.1.2",
    "d3-org-chart": "2.6.0",
*/
/**        "d3": "^5.15.1",
        "d3-org-chart": "^1.0.12",
 */
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
    size: number = 20;
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

export class NodeProps {
    name: string;
    roleName: string;
    imageUrl: string;
    area: string;
    profileUrl: string;
    office: string;
    tags: string;
    isLoggedUser: boolean;
    positionName: string;
    id: string;
    parentId: string;
    size: string;
    progress: number[];
    _directSubordinates: number;
    _totalSubordinates: number;
    _upToTheRootHighlighted: boolean;
}
@Component({
    selector: "app-d3-org-chart",
    templateUrl: "./d3-org-chart.component.html",
    styleUrls: ["./d3-org-chart.component.scss"]
})
export class D3OrgChartComponent implements OnChanges, OnInit {
    @ViewChild("chartContainer") chartContainer: ElementRef;
    data: any[] = null;
    // private eventsSubscription: Subscription;

    // @Input() events: Observable<void>;
    chart: any;
    templateEmployee: string = '<div><div style="margin-left:70px; margin-top:10px; font-size:20pt; font-weight:bold;">NAME</div><div style="margin-left:70px; margin-top:3px;font-size:16pt;">DESIGNATION </div> <div style="margin-left:70px;margin-top:3px;font-size:14pt;">PROJECT</div></div>';
    templateOrg: string = '<div><div style="margin-left:70px; margin-top:10px; font-size:20pt; font-weight:bold;"> NAME </div> </div>';
    reName = /NAME/g;
    reDesignation = /DESIGNATION/g;
    reProject = /PROJECT/g;
    constructor(private employeeService: EmployeeService,) { }


    ngOnDestroy() {
        //this.eventsSubscription.unsubscribe();
    }

    ngOnInit() {
        console.log(d3);
       // this.eventsSubscription = this.events.subscribe(() => this.downloadPdf());

        this.employeeService.getCompanyHierarchy().subscribe((resp) => {
            let data = resp as unknown as CompanyHierarchyViewDto[];
            if (this.data == null) this.data = [];

            data.forEach(org => {
                let item: NodeProps = new NodeProps()

                item.id = `0-${org.chartId}`
                if (org.selfId)
                    item.parentId = `0-${org.selfId}`
                else item.parentId = null

                item.name = org.roleName;
                item.roleName = org.roleName;
                item.imageUrl = "url('http://localhost:4200/src/assets/layout/images/default_icon_employee.jpg')"
                item.office = `Office-${org.hierarchyLevel}`
                item.isLoggedUser = false;
                item.area = org.roleName;
                item.profileUrl = "http://localhost:4200/src/assets/layout/images/default_icon_employee.jpg"
                item.positionName = `Position-${org.roleId}`
                item.positionName = `Size-${org.selfId}`
                item._upToTheRootHighlighted = true;

                const val = Math.round(org.roleName.length / 2);
                item.progress = [...new Array(val)].map((d) => Math.random() * 25 + 5);

                item._directSubordinates = data.filter(d => d.selfId == org.chartId).length
                item._totalSubordinates = data.filter(d => d.hierarchyLevel > org.hierarchyLevel).length


                this.data.push(item)
            });

            console.log(this.data);
            this.updateChart();
        });
    }

    ngAfterViewInit() {
        if (!this.chart) {
            this.chart = new OrgChart();
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
        // this.chart
        //     .container(this.chartContainer.nativeElement)
        //     .data(this.data)
        // //     .rootMargin(100)
        // //   .nodeWidth((d) => 210)
        // //   .nodeHeight((d) => 140)
        // //   .childrenMargin((d) => 130)
        // //   .compactMarginBetween((d) => 75)
        // //   .compactMarginPair((d) => 80)
        //     .svgWidth(500)
        //     .initialZoom(0.6)
        //     .onNodeClick(d => console.log(d + ' node clicked'))
        //     .render();

        this.chart.container(this.chartContainer.nativeElement)
            .svgHeight(window.innerHeight - 350)
            .data(this.data)
            .nodeHeight((d) => 170)
            .nodeWidth((d) => {
                if (d.depth == 0) return 500;
                return 330;
            })
            .childrenMargin((d) => 90)
            .compactMarginBetween((d) => 65)
            .compactMarginPair((d) => 100)
            .neightbourMargin((a, b) => 50)
            .siblingsMargin((d) => 100)
            .buttonContent(({ node, state }) => {
                return `<div style="color:black;border-radius:5px;padding:5px;font-size:10px;margin:auto auto;background-color:#ffffff;border: 1px solid #ff820e;margin-top:14px"> <span style="font-size:9px">${node.children
                    ? `<i class="fas fa-angle-up"></i>`
                    : `<i class="fas fa-angle-down"></i>`
                    }</span> ${node.data._directSubordinates}  </div>`;
            })
            .linkUpdate(function (d, i, arr) {
                d3.select(this)
                    .attr("stroke", (d) =>
                        d.data._upToTheRootHighlighted ? "#fec087" : "#ff820e"
                    )
                    .attr("stroke-width", (d) => (d.data._upToTheRootHighlighted ? 5 : 1));

                if (d.data._upToTheRootHighlighted) {
                    d3.select(this).raise();
                }
            })
            .nodeContent(function (d, i, arr, state) {
                const projectDesc = `<div class="pie-chart-wrapper" style="margin-left:10px;margin-top:5px;width:320px;height:300px">Testing- Add Project description At CEO Level</div>`;
                const projectNoDesc = `<div class="pie-chart-wrapper" style="margin-left:10px;margin-top:5px;width:320px;height:300px"></div>`
                let desc = projectNoDesc;
                const reCEO = /^CEO$/gi;
                if (reCEO.test(d.data.name)) {
                    desc = projectDesc;
                }

                const svgStr = `<svg width=150 height=75  style="background-color:none"> <path d="M 0,15 L15,0 L135,0 L150,15 L150,60 L135,75 L15,75 L0,60" fill="#f3851f" stroke="#f3851f"/> </svg>`;
                return `
                        <div class="left-top" style="position:absolute;left:-10px;top:-10px">  ${svgStr}</div>
                        <div class="right-top" style="position:absolute;right:-10px;top:-10px">  ${svgStr}</div>
                        <div class="right-bottom" style="position:absolute;right:-10px;bottom:-14px">  ${svgStr}</div>
                        <div class="left-bottom" style="position:absolute;left:-10px;bottom:-14px">  ${svgStr}</div>
                        <div style="font-family: 'Inter'; background-color:#ffffff;sans-serif; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width
                    }px;height:${d.height}px;border-radius:0px;border: 2px solid #ff820e">
                           ${desc}
                          <div style="color:black;position:absolute;right:15px;top:-20px;">
                            <div style="font-size:15px;color:black;margin-top:32px"> ${d.data.name
                    } </div>
                            <div style="font-size:10px;"> ${d.data.positionName || ""
                    } </div>
                            <div style="font-size:10px;"> ${d.data.id || ""} </div>
                            ${d.depth == 0
                        ? `                              <br/>
                            <div style="max-width:200px;font-size:10px;">
                              A corporate history of Ian is a chronological account of a business or other co-operative organization he founded.  <br><br>Usually it is produced in written format but it can also be done in audio or audiovisually
                            </div>`
                        : ""
                    }

                          </div>

                          <div style="position:absolute;left:-5px;bottom:10px;">
                            <div style="font-size:10px;color:black;margin-left:20px;margin-top:32px"> Progress </div>
                            <div style="color:black;margin-left:20px;margin-top:3px;font-size:10px;">
                              <svg width=150 height=30> ${d.data.progress
                        .map((h, i) => {
                            return `<rect  width=10 x="${i * 12
                                }" height=${h}  y=${30 - h} fill="#B41425"/>`;
                        })
                        .join("")}  </svg>
                              </div>
                          </div>
                        </div>

    `;
            })
            .nodeUpdate(function (d, i, arr) {
                d3.select(this)
                    .select(".node-rect")
                    .attr("stroke", (d) =>
                        d.data._highlighted || d.data._upToTheRootHighlighted
                            ? "#fec087"
                            : "none"
                    )
                    .attr(
                        "stroke-width",
                        d.data._highlighted || d.data._upToTheRootHighlighted ? 20 : 1
                    );

                //   const pieChartWrapperNode = d3
                //     .select(this)
                //     .select(".pie-chart-wrapper")
                //     .node();
                //   const val = (d.data.name.length * 5) % 100; // Dummy calc
                //   // General pie chart invokation code
                //   new PieChart()
                //     .data([
                //       { key: "plan", color: "#6EC2EA", value: val },
                //       { key: "exec", color: "#0D5AAF", value: 100 - val }
                //     ])
                //     .container(pieChartWrapperNode)
                //     .svgHeight(200)
                //     .svgWidth(320)
                //     .marginTop(40)
                //     .image(d.data.imageUrl)
                //     .backCircleColor("#1F72A7")
                //     .defaultFont("Inter")
                //     .render();
            })
            .render();
        const url: string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QMaAyMA1SdmlAAAAVRJREFUeNrt26FOw2AUhuFTElzrETNLMNPtJVRVVFbtlnYXKGQFqldANo3EoLDUITazzCxBTNBk53lv4M+XJ/ndKZ52L9uft9eP+Oeqbtgs8O7+cbWO36/PiIgmwd4ojsdIU9n2l7XzNBYZNj9Eos6oTRbcdMAZAwxYgAVYgAVYgAUYsAALsAALsAALMGABFmABFmABFmABBizAAqwFgZ/fv+slHl7q3aobNpn2proujIgo276ep/HgixZgARZgARZgAQYswAIswAIswAIswIAFWIAFWIAFWIABC7AAC7AAC7D+AHZdeN97XRf6ogVYgAVYgAVYgAELsAALsAALsAADFmABFmABFmABFmDAAizAAizAAqxrYNeF973XdaEvWoAFWIAFWIAFGLAAC7AAC7AACzBgARZgARZgARZgAQYswAIswAKsW0p1m1S2/WXtPI1Fhs0nxU1Jj2yxm2sAAAAASUVORK5CYII=`;
        const replaced = url.replace(/(\r\n|\n|\r)/gm, '');
        d3.select(".svg-chart-container")
            .style(
                "background",
                'radial-gradient(circle at center, #04192B 0, #000B0E 100%) url("https://raw.githubusercontent.com/bumbeishvili/coronavirus.davidb.dev/master/glow.png")'
            )
            .style(
                "background-image",
                `url(${replaced}), radial-gradient(circle at center, #ffffff 0, #ffffff 100%)`
            );
    }


    downloadPdf() {
        if (this.chart) {
            this.chart.exportImg({
                save: false,
                onLoad: (base64) => {
                    var pdf = new jsPDF();
                    var img = new Image();
                    img.src = base64;
                    img.onload = function () {
                        pdf.addImage(
                            img,
                            "JPEG",
                            5,
                            5,
                            595 / 3,
                            ((img.height / img.width) * 595) / 3
                        );
                        pdf.save("chart.pdf");
                    };
                }
            });
        }
    }

}

