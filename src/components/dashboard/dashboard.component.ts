import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { AppContext } from "../../infrastructure/app.context";
import { MatTableDataSource } from "@angular/material/table";
import { FileInfo, MIME_TYPE_FOLDER } from "../../models/fileInfo";
import { BreadCrumbItem } from "../../models/breadCrumbItem";
import { BreadCrumbItemOption, OPTION_NEW_FOLDER, OPTION_UPLOAD_FILES, OPTION_GET_ALL_SHARABLE_LINKS } from "../../models/breadCrumbItemOption";
import { MatDialog } from "@angular/material/dialog";
import { DialogOneInputComponent } from "../dialogoneinput/dialogoneinput.component";
import { DialogOneInputData } from "../../models/dialogOneInputData";
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSort } from '@angular/material/sort';
import { FilesUploadComponent } from "../filesupload/filesupload.component";
import { DialogShareableLinksComponent } from "../dialogshareablelinks/dialogshareablelinks.component";


@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {

    @ViewChild(MatSort) sort: MatSort;
    breadCrumbItems: BreadCrumbItem[] = [];
    dataSource: MatTableDataSource<FileInfo>;
    displayedColumns: string[] = ["icon", "Name", "modifiedTime", "size", "delete"];
    files: FileInfo[] = [];

    constructor(
        private appContext: AppContext,
        private bottomSheet: MatBottomSheet,
        private zone: NgZone,
        public dialog: MatDialog,
    ) {
        this.dataSource = new MatTableDataSource(this.files);

        this.appContext.Session.File.uploadFinished.subscribe(() => {
            this.refresh(this.appContext.Session.BreadCrumb.currentItem.Id);
        });
    }

    getAllShareableLinks() {
        this.appContext.Repository.File.getAllShareableLinks(this.files)
            .then(() => {

                const dialogRef = this.dialog.open(DialogShareableLinksComponent, {
                    width: '730px',
                    data: this.dataSource.data
                });

                dialogRef.afterClosed().subscribe(result => { });
            });

    }

    navigateTo(file: FileInfo) {
        if (file.IsFolder) {
            this.appContext.Repository.File.getFiles(file.Id)
                .then((res) => {
                    this.zone.run(() => {
                        this.files = res;
                        this.dataSource = new MatTableDataSource(this.files);
                        this.dataSource.sort = this.sort;

                        this.appContext.Session.BreadCrumb.navigateTo(file.Id, file.Name);
                        this.breadCrumbItems = this.appContext.Session.BreadCrumb.items;
                    });
                });
        }
    }

    createNewFolder() {
        var data: DialogOneInputData = new DialogOneInputData();
        data.DefaultInputText = "Untitled folder";
        data.Title = "New folder"
        const dialogRef = this.dialog.open(DialogOneInputComponent, {
            width: '500px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.appContext.Repository.File.create(
                    this.appContext.Session.BreadCrumb.currentItem.Id,
                    result)
                    .then((file: FileInfo) => {
                        this.appContext.Session.BreadCrumb.navigateTo(file.Id, file.Name);
                    });
            }

        });
    }

    delete(file: FileInfo) {
        var index = this.files.indexOf(file);
        if (index > -1) {
            this.files.splice(index, 1);
            this.appContext.Repository.File.delete(file.Id)
                .then(() => {
                    this.zone.run(() => {
                        this.dataSource = new MatTableDataSource(this.files);
                        this.dataSource.sort = this.sort;

                        console.log("Delete successfully");
                    });
                });
        }
    }


    ngOnInit(): void {
        this.appContext.Session.BreadCrumb.init();
        this.breadCrumbItems = this.appContext.Session.BreadCrumb.items;
        this.refresh("root");
    }



    onSelectedItemChanged($event: BreadCrumbItem) {
        let fileInfo: FileInfo = new FileInfo();
        fileInfo.Id = $event.Id;
        fileInfo.Name = $event.Name;
        fileInfo.MimeType = MIME_TYPE_FOLDER;
        this.navigateTo(fileInfo);
    }

    onSelectedOptionChanged($event: BreadCrumbItemOption) {
        if ($event.Option === OPTION_NEW_FOLDER) {
            this.createNewFolder();
        }
        else if ($event.Option === OPTION_UPLOAD_FILES) {
            this.bottomSheet.open(FilesUploadComponent, { data: $event.Data });
        }
        else if ($event.Option === OPTION_GET_ALL_SHARABLE_LINKS) {
            this.getAllShareableLinks();


        }
    }

    refresh(fileId: string) {
        this.appContext.Repository.File.getFiles(fileId)
            .then((res) => {
                this.zone.run(() => {
                    this.files = res;
                    this.dataSource = new MatTableDataSource(this.files);
                    this.dataSource.sort = this.sort;

                });
            });
    }
}