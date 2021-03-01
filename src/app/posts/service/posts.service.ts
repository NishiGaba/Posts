import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../interface/post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {

  }

  getPosts() {
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title : post.title,
          content : post.content,
          id : post._id
        }
      })
    }))
    .subscribe((transformedPosts)=> {
      this.posts = transformedPosts;
      this.postUpdated.next([...this.posts]);
    });
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    return {...this.posts.find(p => p.id === id)};
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData)=>{
      console.log(responseData.message);
      const postId = responseData.postId;
      post.id = postId;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
    });
  }

  deletePost(postId : string) {
    this.http.delete('http://localhost:3000/api/posts/'+ postId)
    .subscribe(() => {
      console.log('Post Deleted!');
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }

}
