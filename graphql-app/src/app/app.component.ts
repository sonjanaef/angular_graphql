import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Todo} from '../../../graphql-server/src/schema';
 
const allTodosQuery = gql`
  query {
    getTodos {
      id
      title
      done
    }
  }
`;
	
const addTodoMutation = gql`
  mutation addTodo($title: String!, $done: Boolean! = false) {
    addTodo(title: $title, done: $done) {
      id
      title
      done
    }
  }
`;
 
const updateTodoMutation = gql`
  mutation updateTodo($id: ID!, $done: Boolean!) {
    updateTodo(id: $id, done: $done) {
      id
      title
      done
    }
  }
`;
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todoItems: Todo[] = [];
 
  constructor(private apollo: Apollo) {  
  }

  ngOnInit () {
    this.apollo
    .watchQuery<{getTodos: Todo[]}>({
      query: allTodosQuery
    })
    .valueChanges
    .subscribe(result => {
      this.todoItems = result.data.getTodos;
    });
  }
 
  addTodo(title: string) {
    this.apollo.mutate<{addTodo: Todo[]}>({
      mutation: addTodoMutation,
      variables: {
        title
      }
    }).subscribe(result => {
      this.todoItems = result.data.addTodo;
    })
  }
 
  updateTodo(id: string, done: boolean) {
    this.apollo.mutate<{updateTodo: Todo[]}>({
      mutation: updateTodoMutation,
      variables: {
        id,
        done
      }
    }).subscribe(result => {
      this.todoItems = result.data.updateTodo;
    })
  }
}