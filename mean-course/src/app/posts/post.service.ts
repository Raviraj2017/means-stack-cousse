import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { typeSourceSpan } from '@angular/compiler';




@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts:Post[],postsCount: number}>();

    constructor(private http: HttpClient, private router: Router) {

    }

    getPost(postPerPage:number,currentPage:number) {
       debugger;
       const PostQueryParams = `?pageSize=${postPerPage}&page=${currentPage}`
       // return [...this.posts];
       this.http.get<{message: string, posts: any,maxPosts: number}>('http://localhost:3000/api/posts'+PostQueryParams)
       .pipe(
         map((postData) => {
         return {Posts: postData.posts.map(post => {
           return{
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
           };
         }),
         maxPosts: postData.maxPosts
        };
       }))
       .subscribe((transformnedPostsData) => {
         this.posts = transformnedPostsData.Posts.reverse();
         this.postsUpdated.next({
          posts: [...this.posts],
          postsCount:transformnedPostsData.maxPosts
      });
       });
    }

    getPostUpdateListener() {
      return this.postsUpdated.asObservable();
    }


    getPost1(id: string) {
      debugger;
     // return {...this.posts.find(p => p.id === id)};
      return this.http.get<{_id: string, title: string, content: string,imagePath: string}>('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string, image: File) {
        debugger;
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        //const post: Post = {id: null, title , content};
        this.http.post<{message: string,post:Post}>('http://localhost:3000/api/posts', postData)
        .subscribe((responseData) => {
         this.router.navigate(['/']);
        });
    }

    updatePost(id: string, title: string, content: string,image: File|string) {
      debugger;
      let postData: Post | FormData;

      if(typeof(image)=== 'object') {
         postData = new FormData();
         postData.append('id',id)
         postData.append('title',title);
         postData.append('content',content);
         postData.append('image', image, title);
      } else {
         postData = {
          id: id,
          title: title,
          content: content,
          imagePath: image
        };
      }
     // const post: Post = { id, title, content,imagePath: null };

      this.http.put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe(response => {
          this.router.navigate(['/']);
        });
    }

    deletePosts(postId: string) {
     return  this.http
     .delete<{message: string}>('http://localhost:3000/api/posts/' + postId);

    }
}
