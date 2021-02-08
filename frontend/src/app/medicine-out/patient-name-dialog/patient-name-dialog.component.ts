import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MedicineOutService} from "../medicine-out.service";
import {generalMessages, messages} from "../../shared/validators/commonErrorMessages";
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
    selector: 'app-patient-name-dialog',
    templateUrl: './patient-name-dialog.component.html',
    styleUrls: ['./patient-name-dialog.component.css']
})
export class PatientNameDialogComponent implements OnInit {
    patientForm: FormGroup;
    errorMessages=messages;

    constructor(public dialogRef: MatDialogRef<PatientNameDialogComponent>,
                private formBuilder: FormBuilder,
                private medicineService: MedicineOutService,
                private router:Router) {
    }

    ngOnInit() {
        this.createForm();
    }

    public createForm() {
        this.patientForm = this.formBuilder.group({
            full_name: [null, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(256),
            ]],
            patient_id: [null]
        });
    }

    close(result:any=null){
        this.dialogRef.close(result);
    }
    store(value) {
        this.medicineService.storeName(value).subscribe((res) => {
            console.log(res);
            this.close(res);
        }, error => console.log(error))
    }
}
