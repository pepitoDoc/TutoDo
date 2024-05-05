import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { GuideStep } from '../../model/data';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';


@Component({
  selector: 'tutodo-guide-steps',
  templateUrl: './guide-steps.component.html',
  styleUrl: './guide-steps.component.scss'
})
export class GuideStepsComponent implements OnInit {

  stepsForm: FormGroup = this.fb.group({
    steps: this.fb.array([
      this.fb.group({
        title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
        saved: [false]
      })
    ])
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  savedSteps: GuideStep[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: ApiService
  ) { }

  ngOnInit(): void {

  }

  addStep(index: number): void {
    this.steps.controls.splice(index, 0, this.createNewStep());
  }

  saveStep(index: number): void {
    this.steps.controls[index].get('title')?.disable();
    this.steps.controls[index].get('description')?.disable();
    this.steps.controls[index].get('saved')?.setValue(true);
  }

  cancelStep(index: number): void {
    this.steps.controls.splice(index, 1);
  }

  modifyStep(index: number): void {
    this.steps.controls[index].get('title')?.enable();
    this.steps.controls[index].get('description')?.enable();
    this.steps.controls[index].get('saved')?.setValue(false);
  }

  get steps() {
    return this.stepsForm.controls['steps'] as FormArray;
  }

  private createNewStep(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
      saved: [false]
    })
  }

}
