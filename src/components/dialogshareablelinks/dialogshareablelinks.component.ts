import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { FileInfo } from "../../models/fileInfo";

@Component({
    selector: "dialogshareablelinks",
    templateUrl: "./dialogshareablelinks.component.html",
    styleUrls: ["./dialogshareablelinks.component.css"]
})
export class DialogShareableLinksComponent {
    links: string[] = [];
    constructor(
        public dialogRef: MatDialogRef<DialogShareableLinksComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FileInfo[]
    ) {
        data.forEach((file) => {
            this.links.push("http://docs.google.com/uc?id=" + file.Id);
        });
    }

    copyToClipboard(link: string) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = link;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
}