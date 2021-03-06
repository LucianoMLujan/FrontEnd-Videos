import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(private _userService: UserService) { 
    this.page_title = "Ajustes";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = new User(this.identity.sub, 
                         this.identity.name, 
                         this.identity.surname, 
                         this.identity.email, 
                         '', 
                         'ROLE_USER', 
                         '');
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    this._userService.update(this.token, this.user).subscribe(
      res => {
        if(res && res.status == 'success') {
          this.status = 'success';
          this.identity = res.user;
          this.user = res.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));
        }else{
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
      }
    );
  }

}
