import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/login/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  siteKey = '6LdA7FcjAAAAAMyL0X_erT301CEdYBA3GztQPb4F';
  theme = 'dark';
  login: FormGroup = this.fb.group({
    user: ['', Validators.required],
    pass: ['', Validators.required]
  });

  protected aFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private route: Router,
    private formBuilder: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });

    if(this.auth.isLogged()){
      this.route.navigateByUrl('/nuovapagina', {replaceUrl : true});
    };

  }
}
