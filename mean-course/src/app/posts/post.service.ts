import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {

    }

    getPost() {
       debugger;
       // return [...this.posts];
       this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
       .pipe(map((postData) => {
         return postData.posts.map(post => {
           return{
            title: post.title,
            content: post.content,
            id: post._id
           };
         });
       }))
       .subscribe((transformnedPosts) => {
         this.posts = transformnedPosts.reverse();
         this.postsUpdated.next([...this.posts]);
       });
    }

    getPostUpdateListener() {
      return this.postsUpdated.asObservable();
    }


    getPost1(id: string) {
      debugger;
     // return {...this.posts.find(p => p.id === id)};
     return this.http.get('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string) {
        debugger;
        const post: Post = {id: null, title , content};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
        .subscribe((responseData) => {
          const id = responseData.postId;
         debugger;
          post.id = id;
          this.posts.unshift(post);
          this.postsUpdated.next([...this.posts]);
        });
    }

    updatePost(id: string, title: string, content: string) {
      debugger;
      const post: Post = { id, title, content };
      this.http.put('http://localhost:3000/api/posts/' + id, post)
        .subscribe(response => {
          const updatedPosts = [...this.posts];
          const oldPostIndex = updatedPosts.findIndex(p => p.id !== post.id);
          updatedPosts[oldPostIndex] = post;
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
        });
    }

    deletePosts(postId: string) {
      this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
      .subscribe((res) => {
        console.log('Deleted');
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
    }
}
