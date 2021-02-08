import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MedicineOutService} from "../medicine-out.service";
import {generalMessages, messages} from "../../shared/validators/commonErrorMessages";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {
  private patientId: number;
  patientPaymentForm: FormGroup;
  errorMessages=messages;

  constructor(public dialogRef: MatDialogRef<PaymentDialogComponent>,
              private formBuilder: FormBuilder,
              private medicineService: MedicineOutService,
              @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {

    this.createForm();
  }

  public createForm() {
    this.patientPaymentForm = this.formBuilder.group({
      payed_price: [this.data.total, [
        Validators.required,
        Validators.min(0),
        Validators.max(this.data.total),
      ]],
      patient_id: [this.data.patientId],
      bill_number: [this.data.billNumber]
    });
  }

  close(result:any=null){
    this.dialogRef.close(result);
  }
  store(value) {
    this.medicineService.storePayment(value).subscribe((res) => {
      this.close(res);
    }, error => console.log(error))
  }
}
