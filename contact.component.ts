import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Feedback, ContactType } from '../shared/feedback';
import { switchMap } from 'rxjs/operators';
import { FeedbackService } from '../services/feedback.service';
import { visibility, flyInOut, expand } from '../animations/app.animation';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand(),
    visibility()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm!: FormGroup;
  feedback: Feedback | any;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackCopy: Feedback | any;
  errMssg: string | undefined;
  feedbacks: Feedback [] | any;
  visibility =  'shown';
  submitted: boolean | undefined;

  formErrors: any = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages: any = {
    'firstname': {
      'requiered': 'First name is required',
      'minlength': 'First name must be at least 2 charecters long',
      'maxlength': 'First name cannot be more than 25 characters long'
    },
    'lastname': {
      'requiered': 'Last name is required',
      'minlength': 'Last name must be at least 2 charecters long',
      'maxlength': 'Last name cannot be more than 25 characters long'
    },
    'telnum': {
      'required': 'Tel. number is required',
      'pattern': 'Tel. number must contain only numbers'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email not in the valid format'
    }
  };

  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
      .subscribe( data => this.onValueChanged(data));

      this.onValueChanged(); // (re) set form validation messages
  }

  onValueChanged(data?: any) {
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
    this.submitted = true;
    this.feedbackCopy = this.feedbackForm.value;
    //console.log(this.feedbackForm);
    this.feedbackService.submitFeedback(this.feedbackCopy)
     .subscribe(feedback => {
      this.feedback = feedback;
      this.feedbackCopy = feedback;
      setTimeout(() => {
        this.submitted = false; }, 5000); },
     errmess => { this.feedback = null; this.feedbackCopy = null; this.errMssg = <any>errmess;});
    this.feedback = this.feedbackForm.value;
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }

}
