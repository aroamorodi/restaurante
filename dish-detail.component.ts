import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility, flyInOut, expand } from '../animations/app.animation';

import { Feedback, ContactType } from '../shared/feedback';
@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishDetailComponent implements OnInit {

  feedbackForm!: FormGroup;
  feedback: Feedback | undefined;
  @ViewChild('fform') feedbackFormDirective: any;
  dish: Dish | any;
  errMssg: string | undefined;
  dishIds: string[] | any;
  prev: string | undefined;
  next: string | undefined;
  dishcopy: Dish | any;
  visibility = 'shown';

  formErrors: any = {
    'author': '',
    'comment': ''
  };

  validationMessages: any ={
    'author': {
      'required': 'Author is required',
      'minlength': 'Author must be at least 2 characters long'
    },
    'comment': {
      'required': 'Comment is required',
      'minlength': 'Comment must be at least 2 characters long'
    }
  }

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL: any) {
      this.createForm();
    }

  ngOnInit(): void {
    //let id = this.route.snapshot.params['id'];
    this.dishService.getDishIds()
     .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
     .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']);}))
     .subscribe(dish => {this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown';},
       errmess => this.errMssg = <any>errmess);
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
      rating: '5',
      date: new Date()
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged();
  }

  onValueChanged(data?:any) {
    if (!this.feedbackForm) { return;}
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.dishcopy?.comments?.push(this.feedbackForm.value);
    console.log(this.dish.comments)
    this.dishService.putDish(this.dishcopy)
     .subscribe(dish => {
       this.dish = dish; this.dishcopy = dish;
     },
     errmess => { this.dish = null; this.dishcopy = null; this.errMssg = <any>errmess;});
    this.feedback = this.feedbackForm.value;
    this.feedbackForm.reset({
      author: '',
      comment: '',
      rating: '',
      date: ''
    });
    const comentarios: Comment[] | any = [];
    //comentarios.push('0', this.feedbackForm.value.comment,this.feedbackForm.value.author,'fecha');



  }

  setPrevNext(dishId: string | undefined): void {
    const index = this.dishIds?.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds?.length + index - 1) % this.dishIds.length]
    this.next = this.dishIds[(this.dishIds?.length + index + 1) % this.dishIds.length]
  }

  goBack(): void {
    this.location.back();
  }

  rating(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

}
