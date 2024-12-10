import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {

  public packages=["Monthly","Quarterly","Yearly"];
  public genders = ["Male","Female"];
  public importantList: string[] = [
    "ToxiC Fat reduction",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Healthier Digestive System",
    "Sugar Craving Body",
    "Fitness"
  ]

  public registerForm!:FormGroup;

  constructor(private fb:FormBuilder,private api:ApiService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName : [''],
      lastName : [''],
      email : [''],
      mobile : [''],
      weight : [''],
      height : [''],
      bmi : [''],
      bmiResult : [''],
      gender : [''],
      requireTrainer : [''],
      package : [''],
      important : [''],
      haveGymBefore: [''],
      enquiryDate : [''],
    });

    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res);
    })
  }

  submit(){
    //console.log(this.registerForm.value)
  }

  calculateBmi(heightValue: number){
    const weight = this.registerForm.value.height;
    const height = heightValue;
    const bmi= weight/ (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch(true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue("Underweight");
          break;
      case (bmi >= 18.5 && bmi < 25):
        this.registerForm.controls['bmiResult'].patchValue("Normal");
          break;
      case (bmi >= 25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue("Overweight");
          break;  
      
      default:
        this.registerForm.controls['bmiResult'].patchValue("Obese");
          break;  
    }
  }
}
