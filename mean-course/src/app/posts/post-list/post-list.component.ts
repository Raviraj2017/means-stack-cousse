import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';
@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

   // posts = [
      //  {title:'First post', content:'This is the first post\'s content'},
     //   {title:'Second post', content:'This is the second post\'s content'},
       // {title:'Thris post', content:'This is the third post\'s content'}
    //]

   //@Input() posts: Post [] = [];
   posts: Post[] = [];
   private postsSub: Subscription;

   constructor(public postService: PostService) {}

   ngOnInit() {
    this.postService.getPost();
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
   });

  }
  onDelete(postId:string){
    this.postService.deletePosts(postId);

  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }



}
