import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../interface/post.model';
import { PostsService } from '../service/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub : Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[])=>{
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

}
