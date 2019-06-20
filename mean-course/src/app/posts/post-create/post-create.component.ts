import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/validation-service.service';

import { Post } from '../post.model';
import { NgForOf } from '@angular/common';
import {  FormGroup, FormControl , Validator, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostService } from '../post.service';
import { mimeType } from './mine-type.validator';

const newLocal = 'create';
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls : ['./post-create.component.css']

    })
export class PostCreateComponent implements OnInit {
    enteredValue = '';
    newPost = 'No Content';
    enteredContent = '';
    enteredTitle = '';
    private mode = 'create';
    private postID: string;
    public post: Post;
    isLoading = false;
    form: FormGroup;
    imagePerview: string = null;
   // @Output() postCreated = new EventEmitter<Post>();

    constructor(public validationService: ValidationService,
                public postService: PostService ,
                public route: ActivatedRoute) {}

      ngOnInit() {

        this.form = new FormGroup({
          title: new FormControl(null, {
            validators: [Validators.required, Validators.minLength(3)]
          }),
          content: new FormControl(null, {validators: Validators.required}),
          image : new FormControl(null, {validators: Validators.required, asyncValidators:[mimeType]})
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
          debugger;
          if (paramMap.has('postId')) {
            this.mode = 'edit';
            this.postID = paramMap.get('postId');
            this.isLoading = true;
            //this.post = this.postService.getPost1(this.postID);
            this.postService.getPost1(this.postID)
              .subscribe(postData => {
                this.isLoading = false;                //
                this.post = {
                  id: postData._id,
                  title: postData.title,
                   content: postData.content,
                   imagePath: postData.imagePath
                  };
                this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath
              });
              });
          } else {
            this.mode = newLocal;
            this.postID = null;
          }
        });
      }

   /* onAddPost(postInput:HTMLTextAreaElement){
        console.dir(postInput);
        //this.newPost = 'The user\'s post'
        this.newPost =  postInput.value;
    }*/

    onImagePicked(evet: Event) {
      debugger;
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePerview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    onSavePost() {
        if (this.form.invalid) {
          return;
        }
        this.isLoading = true;
        debugger;
        if (this.mode === 'create') {
             this.postService.addPost(
               this.form.value.title,
                this.form.value.content,
                this.form.value.image

                );
        } else {
          this.postService.updatePost(
            this.postID,
            this.form.value.title,
            this.form.value.content,
            this.form.value.image
            );
        }
        /*this.newPost = this.enteredValue;
        const post = {
            title: form.value.title,
            content: form.value.content
        };*/
        //this.postCreated.emit(post);
        //this.postService.addPost(form.value.title, form.value.content);
        this.form.reset();
    }



    valueChange(dataMember: string) {
        alert(dataMember);
    }
    checkSpecialCharacter(event) {
    return this.validationService.checkSpecialCharacter(event);
    }

}
