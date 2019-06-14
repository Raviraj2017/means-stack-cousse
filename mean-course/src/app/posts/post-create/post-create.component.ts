import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/validation-service.service';

import { Post } from '../post.model';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls : ['./post-create.component.css']

    })
export class PostCreateComponent implements OnInit {
    enteredValue = "";
    newPost = "No Content";
    enteredContent = '';
    enteredTitle = '';
    private mode: string = 'create';
    private postID: string;
    public post: Post;
   // @Output() postCreated = new EventEmitter<Post>();

    constructor(public validationService: ValidationService,
                public postService: PostService
                ,public route:ActivatedRoute){}

      ngOnInit(){
        this.route.paramMap.subscribe((paramMap:ParamMap) => {
          debugger;
          if (paramMap.has('postId')) {
            this.mode = 'edit';
            this.postID = paramMap.get('postId');
            //this.post = this.postService.getPost1(this.postID);
              this.postService.getPost1(this.postID)
              .subscribe(postData =>{
                this.post ={id: postData._id,title:postdata}
              })
          } else {
            this.mode = 'create';
            this.postID = null;
          }
        });
      }

   /* onAddPost(postInput:HTMLTextAreaElement){
        console.dir(postInput);
        //this.newPost = 'The user\'s post'
        this.newPost =  postInput.value;
    }*/
    onSavePost(form: NgForm) {
        if (form.invalid) {
          return;
        }
        debugger;
        if (this.mode === 'create') {
             this.postService.addPost(form.value.title, form.value.content);
        } else {
          this.postService.updatePost(
            this.postID,
            form.value.title,
            form.value.content
            );
        }
        /*this.newPost = this.enteredValue;
        const post = {
            title: form.value.title,
            content: form.value.content
        };*/
        //this.postCreated.emit(post);
        //this.postService.addPost(form.value.title, form.value.content);
        form.resetForm();
    }



    valueChange(dataMember:string){
        alert(dataMember);
    }
    checkSpecialCharacter(event)
    {
    return this.validationService.checkSpecialCharacter(event);
    }

}
