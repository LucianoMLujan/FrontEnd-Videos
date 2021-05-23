import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Video } from '../../models/video';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-video-new',
  templateUrl: './video-new.component.html',
  styleUrls: ['./video-new.component.css'],
  providers: [UserService, VideoService]
})
export class VideoNewComponent implements OnInit {

  public page_title: string;
  public status: string;
  public identity;
  public token;
  public video: Video;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _videoService: VideoService
  ) { 
    this.page_title = 'Nuevo video';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.video = new Video(1, this.identity.sub, '', '', '', '', null, null);
  }

  onSubmit(form) {
    this._videoService.create(this.token, this.video).subscribe(
      res => {
        if(res.status == 'success') {
          this.status = 'success';
          this._router.navigate(['/inicio']);
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
