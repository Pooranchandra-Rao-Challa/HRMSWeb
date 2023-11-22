import { OnChanges, Component, ViewChild, ElementRef, OnInit, Output, EventEmitter, Input, } from "@angular/core";
import * as d3 from 'd3';
import { OrgChart } from "./orgChart";
import { PieChart } from "./pieChart";
import { EmployeeService } from "src/app/_services/employee.service";
import { jsPDF } from "jspdf";
import { DownloadNotification, NodeDropNotifier, OrgChartDataNotification } from "src/app/_services/notifier.services";
import { AdminService } from "src/app/_services/admin.service";
import { EmployeeHierarchyDto } from "src/app/_models/admin";
import { NodeProps, NodeDropParams } from 'src/app/_models/admin'
/*
  "d3": "7.6.1",
    "d3-flextree": "2.1.2",
    "d3-org-chart": "2.6.0",
*/
/**        "d3": "^5.15.1",
        "d3-org-chart": "^1.0.12",
 */


@Component({
    selector: "app-d3-org-chart",
    templateUrl: "./d3-org-chart.component.html",
    styleUrls: ["./d3-org-chart.component.scss"]
})
export class D3OrgChartComponent implements OnChanges, OnInit {
    @ViewChild("chartContainer", { static: false, read: ElementRef }) chartContainer: ElementRef;
    @Input() Data: any[] = null;
    @Output() OnDropEvent = new EventEmitter<NodeProps>();
    @Input() DisplayType: string = '1';

    // @Input() events: Observable<void>;
    chart: OrgChart;
    reName = /NAME/g;
    reDesignation = /DESIGNATION/g;
    reProject = /PROJECT/g;
    constructor(
        //private employeeService: EmployeeService,
        private downloadNotifier: DownloadNotification,
      //  private chartDataNotification: OrgChartDataNotification,
      //  private adminService: AdminService,
        private nodeDropNotifier: NodeDropNotifier) { }


    ngOnDestroy() {
        //this.eventsSubscription.unsubscribe();
    }

    ngOnInit() {
        // console.log(d3);
        // this.eventsSubscription = this.events.subscribe(() => this.downloadPdf());
        //this.organizationData();
        this.downloadNotifier.getData().subscribe(value => {
            if (value === true) {
                this.downloadPdf();
            }
        })
        // this.projectNotifier.getSelectedProjectId().subscribe(value => {
        //     if (value === -1) {
        //         this.organizationData();
        //     }
        //     else {
        //         this.employeeProjectData(value);
        //     }
        // })
        // this.chartDataNotification.getNodes().subscribe(value =>{
        //     if (!this.chart) {
        //         this.chart = new OrgChart();
        //     }
        //     //if(this.DisplayType == '1')
        //         this.Data = value.nodes;
        //     //else
        //     this.updateChart(this.chart,this.Data);
        //     //console.log('chartDataNotification');
        //     this.updateElements();
        // });

        this.OnDropEvent.subscribe((value) => {
            //console.log(value);
            this.nodeDropNotifier.sendDropNodes({
                DropNode: value
            })
        })
    }

    ngAfterViewInit() {

        // if (!this.chart) {
        //     this.chart = new OrgChart();
        // }
        // this.updateChart(this.chart, this.Data);

    }

    UpdateChart() {
        if (!this.chart) {
            this.chart = new OrgChart();
        }
        // console.log(this.DisplayType);
        // console.log(this.Data);
        // console.log(this.chartContainer.nativeElement);


        this.updateChart(this.chart, this.Data);
    }

    updateElements() {
        // let data: HTMLCollection = document.getElementsByClassName("node-foreign-object-div");
        // console.log(data);
        // let i: number = 0;
        // while(data.length > 0 && i < data.length){
        //     console.log(data[i]);

        //     // document.getElementsByClassName("node-foreign-object-div")[i].addEventListener("dragover", function(event) {
        //     //     event.preventDefault();
        //     //   })
        //     // document.getElementsByClassName("node-foreign-object-div")[i].addEventListener("drop",function(){
        //     //     alert('test')
        //     // });
        //     i++;
        // }
    }

    ngOnChanges() {
        this.updateChart(this.chart, this.Data);
        this.updateElements();
    }


    // organizationData() {
    //     this.data = [];
    //     this.employeeService.getCompanyHierarchy().subscribe((resp) => {
    //         let data = resp as unknown as CompanyHierarchyViewDto[];
    //         if (this.data == null) this.data = [];

    //         data.forEach(org => {

    //             let item: NodeProps = new NodeProps()

    //             item.id = `0-${org.chartId}`
    //             if (org.selfId)
    //                 item.parentId = `0-${org.selfId}`
    //             else item.parentId = null

    //             item.name = org.roleName;
    //             item.roleName = org.roleName;
    //             item.imageUrl = "assets/layout/images/default_icon_employee.jpg"
    //             item.office = `Office-${org.hierarchyLevel}`
    //             item.isLoggedUser = false;
    //             item.area = org.roleName;
    //             item.profileUrl = "assets/layout/images/default_icon_employee.jpg"
    //             item._upToTheRootHighlighted = true;
    //             const val = Math.round(org.roleName.length / 2);
    //             item.progress = [...new Array(val)].map((d) => Math.random() * 25 + 5);

    //             item._directSubordinates = data.filter(d => d.selfId == org.chartId).length
    //             item._totalSubordinates = data.filter(d => d.hierarchyLevel > org.hierarchyLevel).length


    //             this.data.push(item)
    //         });
    //         this.updateChart(this.chart,this.data);
    //     });
    // }


    // employeeProjectData(projectId: number) {
    //     this.data = [];
    //     this.adminService.GetEmployeeHierarchy(projectId).subscribe((resp) => {
    //         let data = resp as unknown as EmployeeHierarchyDto[];
    //         data.forEach(empchart => {
    //             let item: NodeProps = new NodeProps()

    //             item.id = `1-${empchart.chartId}-${empchart.employeeId}`; // Use a unique prefix like "1-" for this project
    //             if (empchart.selfId && empchart.reportingToId)
    //                 item.parentId = `1-${empchart.selfId}-${empchart.reportingToId}`; // Make sure the parent ID is unique too
    //             else item.parentId = null

    //             item.name = empchart.employeeName;
    //             item.roleName = empchart.employeeName;
    //             item.designation = empchart.designation;
    //             item.imageUrl = "assets/layout/images/default_icon_employee.jpg"
    //             if (empchart.photo) item.imageUrl = empchart.photo
    //             else item.imageUrl = 'data:image/jpeg;base64,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';
    //             item.office = `Office-${empchart.hierarchyLevel}`
    //             item.isLoggedUser = false;
    //             item.area = empchart.employeeName;
    //             item.profileUrl = "assets/layout/images/default_icon_employee.jpg";
    //             item.projectDescription = empchart.projectDescription
    //             item.projectName = empchart.projectName
    //             item.clientName = empchart.clientName
    //             item.clientCompanyName = empchart.clientCompanyName
    //             item.noOfWorkingDays = empchart.noOfWorkingDays
    //             item.noOfAbsents = empchart.noOfAbsents
    //             item.noOfLeaves = empchart.noOfLeaves
    //             item.assetCount = empchart.assetCount

    //             // item.positionName = `Position-${empchart.roleId}`
    //             // item.positionName = `Size-${empchart.selfId}`
    //             item._upToTheRootHighlighted = true;

    //             const val = Math.round(empchart.roleName.length / 2);
    //             item.progress = [...new Array(val)].map((d) => Math.random() * 25 + 5);

    //             item._directSubordinates = data.filter(d => d.selfId == empchart.chartId).length;
    //             item._totalSubordinates = data.filter(d => d.hierarchyLevel > empchart.hierarchyLevel).length;

    //             this.data.push(item);
    //         });

    //         console.log(this.data);
    //         this.updateChart(this.chart,this.chart);
    //     });
    // }


    updateChart(chart, data, onDropEvent = this.OnDropEvent) {
        if (!data || data.length == 0) {
            return;
        }
        if (!chart) {
            return;
        }
//d3.selectAll(".node").call(d3.drag().on("start", started));
        const url: string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QMaAyMA1SdmlAAAAVRJREFUeNrt26FOw2AUhuFTElzrETNLMNPtJVRVVFbtlnYXKGQFqldANo3EoLDUITazzCxBTNBk53lv4M+XJ/ndKZ52L9uft9eP+Oeqbtgs8O7+cbWO36/PiIgmwd4ojsdIU9n2l7XzNBYZNj9Eos6oTRbcdMAZAwxYgAVYgAVYgAUYsAALsAALsAALMGABFmABFmABFmABBizAAqwFgZ/fv+slHl7q3aobNpn2proujIgo276ep/HgixZgARZgARZgAQYswAIswAIswAIswIAFWIAFWIAFWIABC7AAC7AAC7D+AHZdeN97XRf6ogVYgAVYgAVYgAELsAALsAALsAADFmABFmABFmABFmDAAizAAizAAqxrYNeF973XdaEvWoAFWIAFWIAFGLAAC7AAC7AACzBgARZgARZgARZgAQYswAIswAKsW0p1m1S2/WXtPI1Fhs0nxU1Jj2yxm2sAAAAASUVORK5CYII=`;
        const replaced = url.replace(/(\r\n|\n|\r)/gm, '');
        this.chart.container(this.chartContainer.nativeElement)
            .svgHeight(window.innerHeight)
            .svgWidth(window.innerWidth - (this.DisplayType == "1" ? 300 : 500))
            .displayType(this.DisplayType)
            .data(data)
            .nodeHeight((d) => 180)
            .nodeWidth((d) => {
                if (d.depth == 0 && this.DisplayType == "1") return 500;
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
                const projectDesc = `
                    <div class="pie-chart-wrapper" style="margin-left:10px;margin-top:5px;width:320px;height:300px">
                        Testing- Add Project description At CEO Level
                    </div>`;
                const projectNoDesc = `
                    <div class="pie-chart-wrapper" style="margin-left:10px;margin-top:5px;width:320px;height:300px"></div>`;
                let desc = projectNoDesc;

                const reCEO = /^CEO$/gi;
                if (reCEO.test(d.data.name)) {
                    desc = projectDesc;
                }
                //    width: 516px; height: 296px;     margin-top: -8px;     margin-left: -8px;
                // pDroppable="allottedemployee"  pDraggable (onDragStart)="dragStart(product)" (onDragEnd)="dragEnd()" (onDrop)="drop(d.data)"
                const svgStr = `<svg width=150 height=75 style="background-color:transparent">
                    <path d="M 0,15 L15,0 L135,0 L150,15 L150,60 L135,75 L15,75 L0,60" fill="#f3851f" stroke="#f3851f"/>
                </svg>`;

                return `
                    <div class="left-top" style="position:absolute;left:-10px;top:-10px">${svgStr}</div>
                    <div class="right-top" style="position:absolute;right:-10px;top:-10px">${svgStr}</div>
                    <div class="right-bottom" style="position:absolute;right:-10px;bottom:-13px">${svgStr}</div>
                    <div class="left-bottom" style="position:absolute;left:-10px;bottom:-13px">${svgStr}</div>

                    <div draggable="true" style="font-family: inherit; background-color:#ffffff; position:absolute;margin-top:-8px; margin-left:-8px;width:${d.width + 16}px;height:${d.height + 16}px;border-radius:0px;border: 2px solid #ff820e;border-radius: 10px;">
                    ${desc}
                    <div style="color:black;position:absolute;right:15px;top:-20px;">
                            <div style="font-size:15px;color:black;margin-top:32px">${d.data.name}</div>
                            <div style="font-size:10px;">${d.data.designation || ""}</div>
                            <div style="font-size:15px;">
                            ${d.data.projectName ? `<span style="font-size:10px;">Project Name: ${d.data.projectName}</span>` : ''}
                            </div>
                            <div style="font-size:10px;">
                            ${d.data.clientName ? `<span style="font-size:10px;">Client Name: ${d.data.clientName}</span>` : ''}
                            </div>
                            <div style="font-size:10px;">
                            ${d.data.clientCompanyName ? `<span style="font-size:10px;">Client Company Name: ${d.data.clientCompanyName}</span>` : ''}
                            </div>
                            <div style="font-size:10px;">
                            ${d.data.noOfWorkingDays ? `<span style="color:orange;font-size:10px;" data-bs-toggle="tooltip" data-bs-placement="top" title="Working Day">WD: ${d.data.noOfWorkingDays}</span>` : ''}
                          </div>
                          <div style="font-size:10px;">
                            ${d.data.noOfAbsents ? `<span style="color:orange;font-size:10px;" data-bs-toggle="tooltip" data-bs-placement="top" title="Absents">Abs: ${d.data.noOfAbsents}</span>` : ''}
                          </div>
                          <div style="font-size:10px;">
                            ${d.data.noOfLeaves ? `<span style="color:orange;font-size:10px;" data-bs-toggle="tooltip" data-bs-placement="top" title="Leaves">Leaves: ${d.data.noOfLeaves}</span>` : ''}
                          </div>
                          <div style="font-size:10px;">
                            ${d.data.assetCount ? `<span style="color:orange;font-size:10px;" data-bs-toggle="tooltip" data-bs-placement="top" title="Allotted Assets">Assets: ${d.data.assetCount}</span>` : ''}
                          </div>




                            ${d.depth == 0
                        ? `<br/>
                                <div style="max-width:200px;font-size:10px;">
                                <div style="font-size:10px;">${d.data.projectDescription || ""}</div>
                                </div>`
                        : ""
                    }
                        </div>
                        <div style="position:absolute;left:-5px;bottom:10px;">
                            <div style="font-size:10px;color:black;margin-left:20px;margin-top:32px">Progress</div>
                            <div style="color:black;margin-left:20px;margin-top:3px;font-size:10px;">
                                <svg width=150 height=30> ${d.data.progress
                        .map((h, i) => {
                            return `<rect width=10 x="${i * 12}" height=${h} y=${30 - h} fill="#B41425"/>`;
                        })
                        .join("")}
                                </svg>
                            </div>
                        </div>
                    </div>
                `;
            })
            .nodeUpdate(function (d, i, arr) {
                d3.select(this)
                    .select(".node-rect")
                    .call(d3.drag().on("start", (envet) =>{ console.log(event);
                    }))
                    .attr("stroke", (d) =>
                        d.data._highlighted || d.data._upToTheRootHighlighted
                            ? "#fff5b7"
                            : "none" //fec087
                    )
                    .attr(
                        "stroke-width",
                        d.data._highlighted || d.data._upToTheRootHighlighted ? 20 : 1
                    );

                const pieChartWrapperNode = d3
                    .select(this)
                    .select(".pie-chart-wrapper")
                    .node()
                    ;
                const val = (d.data.name.length * 5) % 100; // Dummy calc
                // General pie chart invokation code
                new PieChart()
                    .data([
                        { key: "plan", color: "#6EC2EA", value: val },
                        { key: "exec", color: "#0D5AAF", value: 100 - val }
                    ])
                    .container(pieChartWrapperNode)
                    .svgHeight(180)
                    .svgWidth(280)
                    .marginTop(40)
                    .image(d.data.imageUrl)
                    .backCircleColor("#1F72A7")
                    .defaultFont("Inter")
                    .render();
            })
            .render();
            if(this.DisplayType == "2"){
                this.chart.container(this.chartContainer.nativeElement)
                   .onNodeDrop((d) => {
                        onDropEvent.emit(d);
                  })
            }
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
                full: false,
                save: false,
                scale: 2,
                onLoad: (base64) => {
                    var pdf = new jsPDF('p', 'px', 'a4', true);
                    var img = new Image();
                    img.src = base64;
                    //alert(`width:${pdf.internal.pageSize.getWidth()}--height:${pdf.internal.pageSize.getHeight()}`)
                    var width = pdf.internal.pageSize.getWidth();
                    var height = pdf.internal.pageSize.getHeight();//595 / 3   --- ((img.height / img.width) * 595) / 3
                    img.onload = function () {
                        //alert(`width:${img.width}--height:${img.height}`)
                        pdf.addImage(
                            img,
                            "JPEG",
                            20,
                            60,
                            (img.width / img.height) * width,
                            (img.height / img.width) * height,
                            undefined,
                            'FAST'
                        );
                        pdf.save("org-chart.pdf");
                    };
                }
            });
        }
    }

}

