import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public token: string;
  public user: User;
  public identity;
  public status: string;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = "Identificate";
    this.user = new User(1, '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit(): void {
    this.logout();
  } 

  onSubmit(form) {
    this._userService.signup(this.user).subscribe(
      res => {
        if (!res.status || res.status != 'error') {
          this.status = 'success';
          this.identity = res;

          //GET TOKEN
          this._userService.signup(this.user, true).subscribe(
            res => {
              if (!res.status || res.status != 'error') {
                this.status = 'success';
                this.token = res;

                localStorage.setItem('token', this.token);
                localStorage.setItem('identity', JSON.stringify(this.identity));

                this._router.navigate(['/inicio']);

              } else {
                this.status = 'error';
              }
            },
            error => {
              this.status = 'error';
            }
          );

        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
      }
    );
  }

  logout() {
    this._route.params.subscribe(params => {
      let sure = +params['sure'];

      if(sure == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        this._router.navigate(['/inicio']);
      }

    });
  }

}
