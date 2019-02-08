import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.router.navigate(['/']);
      }
    })
  }

  onSubmit() {
    /*email: brad@gmail.com
      password: 123456
    */
    this.authService.login(this.email, this.password)
      .then(
        res => {
          //flashMessage
          this.flashMessage.show("You are now logged in", {
            cssClass: 'alert-success', timeout: 3000
          });
          //redirect to Dashboard
          this.router.navigate(['/']);
        })
      .catch(err => {
        this.flashMessage.show(err.message, {
          cssClass: 'alert-danger', timeout: 3000
        });
      });
  }
}
