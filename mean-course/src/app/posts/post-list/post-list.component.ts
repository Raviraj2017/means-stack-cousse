import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { PageEvent } from '@angular/material';
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
   isLoading =false;
   totalPosts = 0;
   postsPerPage = 2;
   pageSizeOptions = [1,2,5,10];
   currentPage = 1;


   constructor(public postService: PostService) {}

   ngOnInit() {
     this.isLoading= true;
     this.postService.getPost(this.postsPerPage,this.currentPage);
     this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((postData:{posts: Post[],postsCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts= postData.postsCount;
   });

  }

  onChangedPage(pageData : PageEvent) {
    this.isLoading= true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPost(this.postsPerPage, this.currentPage);
  }
  onDelete(postId: string){
    this.isLoading = true;
    this.postService.deletePosts(postId).subscribe(()=>{
      this.postService.getPost(this.postsPerPage,this.currentPage)
    });

  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }



}
