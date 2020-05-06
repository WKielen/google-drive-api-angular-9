import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BreadCrumbItem } from "../../../models/breadCrumbItem";
import { BreadCrumbItemOption, OPTION_NEW_FOLDER, OPTION_UPLOAD_FILES, OPTION_GET_ALL_SHARABLE_LINKS } from "../../../models/breadCrumbItemOption";

@Component({
    selector: "breadcrumbitem",
    templateUrl: "./breadcrumbitem.component.html",
    styleUrls: ["./breadcrumbitem.component.css"]
})
export class BreadCrumbItemComponent {

    @Input()
    model: BreadCrumbItem;

    @Output()
    onSelected: EventEmitter<BreadCrumbItem> = new EventEmitter<BreadCrumbItem>();

    @Output()
    onSelectedOption: EventEmitter<BreadCrumbItemOption> = new EventEmitter<BreadCrumbItemOption>();

    getAllSharableLinks(){
        this.onSelectedOption.emit({ Name: "Get all sharable links", Option: OPTION_GET_ALL_SHARABLE_LINKS, Data: null });
    }

    newFolder() {
        this.onSelectedOption.emit({ Name: "New folder", Option: OPTION_NEW_FOLDER, Data: null });
    }

    select() {
        this.onSelected.emit(this.model);
    }

    uploadFiles($event) {
        this.onSelectedOption.emit({ Name: "Upload files", Option: OPTION_UPLOAD_FILES, Data: $event.target.files })
    }



}