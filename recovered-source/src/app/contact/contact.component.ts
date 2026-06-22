import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { DataService } from "src/app/shared/services/data.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  isSending = false;
  messageSent = false;
  // @ViewChild("formRef")
  constructor(public dialogRef: MatDialogRef<any>, private data: DataService, private http: HttpClient) {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      message: new FormControl("", Validators.required),
      recaptcha: new FormControl(null, Validators.required),
    });
  }
  ngOnInit() {}
  otherFieldsValid() {
    return this.form.get("name").valid && this.form.get("email").valid && this.form.get("message").valid;
  }
  okClicked() {
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }
  onSubmit(formDirective) {
    if (this.form.valid) {
      this.isSending = true;

      const formData: any = {};
      formData.name = this.form.get("name").value;
      formData.email = this.form.get("email").value;
      formData.message = this.form.get("message").value;
      formData["g-recaptcha-response"] = this.form.get("recaptcha").value;

      this.http.post("https://europe-west1-logartisinfocontactform.cloudfunctions.net/ContactForm_LogartisInfo", formData).subscribe((result) => {
        this.isSending = false;
        this.messageSent = true;
        this.form.reset();
        formDirective.resetForm();
      });
    }
  }
}
