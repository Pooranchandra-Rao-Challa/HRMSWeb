import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table';
import { EmployeeService } from '../../_services/employee.service';
import { EmployeesViewDto } from 'src/app/_models/employes';
import { ITableHeader } from 'src/app/_models/common';
import { Router } from '@angular/router';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { JwtService } from 'src/app/_services/jwt.service';
import { ReportService } from 'src/app/_services/report.service';
import * as FileSaver from "file-saver";
import { HttpEventType } from '@angular/common/http';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';
@Component({
    selector: 'app-all-employees',
    templateUrl: './all-employees.component.html',
    styles: [
    ]
})
export class AllEmployeesComponent {
    selectedEmployeeStatus: { label: string; value: string } = { label: 'Active Employees', value: 'Active Employees' };
    employeeStatusOptions: { label: string; value: string }[] = [];
    color1: string = 'Bluegray';
    visible: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    globalFilterFields: string[] = ['employeeName', 'code', 'gender', 'employeeRoleName', 'officeEmailId', 'mobileNumber',];
    employees: EmployeesViewDto[] = [];
    sortOrder: number = 0;
    sortField: string = '';
    mediumDate: string = MEDIUM_DATE
    permissions: any;
    value: number;
    searchKeyword: string = '';
    showSearchBar: boolean = true;

    headers: ITableHeader[] = [
        { field: 'code', header: 'code', label: 'Employee Code' },
        { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
        { field: 'gender', header: 'gender', label: 'Gender' },
        { field: 'employeeRoleName', header: 'employeeRoleName', label: 'Employee Role Name' },
        { field: 'officeEmailId', header: 'officeEmailId', label: 'Email' },
        { field: 'mobileNumber', header: 'mobileNumber', label: 'Phone No' },
        { field: 'dateofJoin', header: 'dateofJoin', label: 'Date of Joining' },
    ];

    constructor(private EmployeeService: EmployeeService,
        private router: Router, private jwtService: JwtService, private reportService: ReportService) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    ngOnInit() {

        this.permissions = this.jwtService.Permissions;
        this.initEmployees(this.selectedEmployeeStatus.value)
        this.employeeStatusOptions = [
            { label: 'Active Employees', value: 'Active Employees' },
            { label: 'InActive Employees', value: 'InActive Employees' },
            { label: 'All Employees', value: 'All Employees' },
        ];
    }

    initEmployees(selectedEmployeeStatus: string) {
        // Fetch only records where IsEnrolled is true
        const isEnrolled = true;
        this.EmployeeService.GetEmployeesBasedonstatus(isEnrolled, selectedEmployeeStatus).subscribe(resp => {
            this.employees = resp as unknown as EmployeesViewDto[];
            this.employees.forEach(employee => this.getEmployeePhoto(employee));
        });
    }

    hideSearchBar(dv: DataView) {
        if (dv._layout === 'list') {
            this.showSearchBar = false;
        } else {
            this.showSearchBar = true;
        }
    }

    showDialog() {
        this.visible = true;
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.searchKeyword = '';
    }

    clearcard(dv: DataView) {
        dv.filteredValue = null;
        this.filter.nativeElement.value = '';
    }
    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    viewEmployeeDtls(employeeId: number) {
        this.router.navigate(['employee/viewemployees'], { queryParams: { employeeId: employeeId } });
    }

    getEmployeePhoto(employee: EmployeesViewDto) {
        return this.EmployeeService.getEmployeePhoto(employee.employeeId).subscribe((resp) => {
            employee.photo = (resp as any).ImageData;
        })
    }

    downloadEmployeesReport() {
        const employeeStatusValue = this.selectedEmployeeStatus?.value;
        this.reportService.DownloadEmployees(employeeStatusValue)
            .subscribe((resp) => {
                if (resp.type === HttpEventType.DownloadProgress) {
                    const percentDone = Math.round(100 * resp.loaded / resp.total);
                    this.value = percentDone;
                }
                if (resp.type === HttpEventType.Response) {
                    const file = new Blob([resp.body], { type: 'text/csv' });
                    const document = window.URL.createObjectURL(file);
                    const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>.]/g, '-');
                    const csvName = `EmployeeReport${currentDate}.csv`;
                    FileSaver.saveAs(document, csvName);
                }
            })
    }



    getBase64ImageFromURL(url: string) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.setAttribute("crossOrigin", "anonymous");

            img.onload = () => {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx!.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                resolve(dataURL);
            };

            img.onerror = error => {
                reject(error);
            };

            img.src = url;
        });
    }

    async pdfHeader() {
        try {
            const headerImage1 = await this.getBase64ImageFromURL('assets/layout/images/Calibrage_logo1.png');
            const headerImage2 = await this.getBase64ImageFromURL('assets/layout/images/head_right.PNG');
            const pageWidth = 841.89;
            const imageWidth = (pageWidth / 4) - 10;
            const createLine = () => [{ type: 'line', x1: 0, y1: 0, x2: 689.85, y2: 0, lineWidth: 0.5, lineColor: '#f3743f' }];

            let row = {
                columns: [
                    {
                        image: headerImage1,
                        width: imageWidth,
                        alignment: 'left',
                        margin: [20, 0, 0, 0] // Remove any margins
                    },
                    {
                        width: '*',
                        text: '', // Empty spacer column
                        alignment: 'center' // Remove any margins
                    },
                    {
                        image: headerImage2,
                        width: imageWidth,
                        alignment: 'right',
                        margin: [0, 0, 5, 0] // Remove any margins
                    },
                ],
                alignment: 'justify',
                margin: [0, 0, 0, 0] // Remove any margins
            };
            return row;
        } catch (error) {
            console.error("Error occurred while formatting key and values:", error);
            throw error; // Propagate the error
        }
    }

    async downloadEmployeespdf(selectedEmployeeStatus) {
        const pageSize = { width: 841.89, height: 595.28 };
        const headerImage = await this.pdfHeader();
        const watermarkImage = await this.getBase64ImageFromURL('assets/layout/images/transparent_logo.png')
        const EmployeesList = this.generateEmployeesList();
        const createFooter = (currentPage: number, pageSize: any) => ({
            margin: [0, 20, 0, 0],
            height: 20,
            background: '#ff810e',
            width: pageSize.width,
            columns: [
                { canvas: [{ type: 'rect', x: 0, y: 0, w: pageSize.width - 65, h: 20, color: '#ff810e' }] },
                {
                    stack: [
                        {
                            text: 'Copyrights © 2024 Calibrage Info Systems Pvt Ltd.',
                            fontSize: 11, color: '#fff', absolutePosition: { x: 20, y: 24 }
                        },
                        {
                            text: `Page ${currentPage}`,
                            color: '#000000', background: '#fff', margin: [0, 0, 0, 0], fontSize: 12, absolutePosition: { x: pageSize.width - 45, y: 24 },
                        }
                    ],
                }
            ],
        });

        const docDefinition = {
            pageOrientation: 'landscape',
            pageSize: pageSize,
            header: () => (headerImage),
            footer: (currentPage: number) => createFooter(currentPage, pageSize),
            background: [{
                image: watermarkImage, width: 200, height: 200,
                absolutePosition: { x: (pageSize.width - 200) / 2, y: (pageSize.height - 200) / 2 },
            }],
            content: [
                { text: selectedEmployeeStatus.label, style: 'header', alignment: 'center' },
                EmployeesList
            ],
            pageMargins: [30, 90, 40, 40],
            styles: {
                header: { fontSize: 25 },
                tableHeader: { fontSize: 13, alignment: 'center', fillColor: '#dbdbdb' },
                borderedText: { border: [1, 1, 1, 1], borderColor: 'rgb(0, 0, 255)', fillColor: '#eeeeee', width: 100, height: 150, margin: [12, 20, 0, 0] },
                defaultStyle: { font: 'Typography', fontSize: 12 },
            },
        };
        pdfMake.createPdf(docDefinition).download('EmployeeReport.pdf');
    }

    generateEmployeesList() {
        const content = [
            [
                { text: 'Employee Code', style: 'tableHeader' },
                { text: 'Employee Name', style: 'tableHeader' },
                { text: 'Certificate DOB', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Date of Joining', style: 'tableHeader' },
                { text: 'Employee Role', style: 'tableHeader' },
                { text: 'Designation', style: 'tableHeader' },
                { text: 'Reporting To', style: 'tableHeader' },
                { text: 'Office Email', style: 'tableHeader' },
                { text: 'Mobile Number', style: 'tableHeader' },
            ],
            ...this.employees.map(employee => [
                employee.code || '',
                employee.employeeName || '',
                employee.certificateDOB ? new Date(employee.certificateDOB).toLocaleDateString() : '',
                employee.gender || '',
                employee.dateofJoin ? new Date(employee.dateofJoin).toLocaleDateString() : '',
                employee.employeeRoleName || '',
                employee.designation || '',
                employee.reportingTo || '',
                employee.officeEmailId || '',
                employee.mobileNumber || '',
            ])
        ];
        return {
            table: {
                headerRows: 1,
                widths: [60, 80, 60, 50, 60, 70, 70, 70, 100, 70],
                body: content,
            },
        };
    }

}
