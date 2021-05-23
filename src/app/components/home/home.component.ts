import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Video } from 'src/app/models/video';
import { AppComponent } from '../../app.component';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService, VideoService]
})
export class HomeComponent implements OnInit {

  public page_title: string;
  public identity;
  public token;
  public videos: Video[];
  public page;
  public nextPage;
  public prevPage;
  public numberPages;

  constructor(
    private _userService: UserService,
    private _videoService: VideoService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 
    this.page_title = "Inicio";
  }

  ngOnInit(): void {
    this.loadUser();
    this.actualPageVideos();
  }

  actualPageVideos() {
    this._route.params.subscribe(params => {
      var page = +params['page'];
      if(!page) {
        page = 1;
        this.prevPage = 1;
        this.nextPage = 2;
      }  
      this.getVideos(page);
    });
  }

  loadUser() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  getVideos(page) {
    this._videoService.getVideos(this.token, page).subscribe(
      res => {
        this.videos = res.videos;
        var number_pages = [];
        for(var i = 1; i <= res.total_pages; i ++) {
          number_pages.push(i);
        }
        this.numberPages = number_pages;

        if(page >= 2) {
          this.prevPage = page-1;
        }else{
          this.prevPage = 1;
        }

        if(page < res.total_pages) {
          this.nextPage = page + 1;
        }else{
          this.nextPage = res.total_pages;
        }

      },
      error => {

      }
    );
  }

  getThumb(url, size) {
    var video, results, thumburl;
    
    if(url === null) {
      return '';
    }

    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];
    if(size != null) {
      thumburl = 'http://img.youtube.com/vi/' + video + '/' + size + '.jpg';
    }else{
      thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
    }
    
    return thumburl;
  }

  deleteVideo(id) {
    this._videoService.delete(this.token, id).subscribe(
      res => {
        this.actualPageVideos();
      },
      error => {

      }
    );
  }

}
