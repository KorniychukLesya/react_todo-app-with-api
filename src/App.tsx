/* eslint-disable no-param-reassign */
import React, {
  FormEvent,
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  createTodo, deleteTodos, getTodos, updateTodoCompleted, updateTodoTitle,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components_Todo/ErrorNotification';
import { NewTodo } from './components_Todo/NewTodo';
import { TodoFilter } from './components_Todo/TodoFilter';

import { TodoList } from './components_Todo/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTitleTodo, setNewTitleTodo] = useState('');

  const [todos, setTodos] = useState<Todo[]>([]);
  const [, setTodoId] = useState(0);

  const [changTitle, setChangTitle] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hasLoadError, setHasLoadError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [completedTodo, setCompletedTodo] = useState(false);
  const [toggleAll, setToggleAll] = useState(false);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      setIsAdding(true);
      getTodos(user.id)
        .then(todo => {
          setTodos(todo);
        }).catch(() => (
          setHasLoadError('Unable to load a todo')
        )).finally(() => setIsAdding(false));
    }
  }, []);

  const handleAddTodo = async (event: FormEvent) => {
    event.preventDefault();
    setHasLoadError('');
    setIsAdding(true);
    if (user && newTitleTodo.trim() !== '') {
      await createTodo(user.id, newTitleTodo)
        .then(todo => {
          setTodos([...todos, todo]);
        })
        .catch(() => setHasLoadError('Unable to add a todo'))
        .finally(() => setIsAdding(false));
    } else {
      setHasLoadError('Title can\'t be empty');
      setIsAdding(false);
    }

    setNewTitleTodo('');
  };

  const handleDeleteTodo = async (event: FormEvent, curentTodoId: number) => {
    event.preventDefault();
    setTodoId(curentTodoId);
    setIsAdding(true);

    await deleteTodos(curentTodoId)
      .then(() => {
        setTodos([...todos.filter(({ id }) => id !== curentTodoId)]);
      })
      .catch(() => setHasLoadError('Unable to delete a todo'))
      .finally(() => setIsAdding(false));
  };

  const handleClearCompleted = () => {
    setIsAdding(true);
    const clearCompleted = () => ([...todos].forEach(todo => {
      if (todo.completed === true) {
        deleteTodos(todo.id)
          .then(() => {
            setTodos([...todos.filter(({ completed }) => completed !== true)]);
          })
          .catch(() => setHasLoadError('Unable to delete a todo'))
          .finally(() => setIsAdding(false));
      }
    })
    );

    clearCompleted();
  };

  const handleChangeCompleted = async (curentTodoId: number) => {
    setCompletedTodo(!completedTodo);

    const filterTodo = todos.map(todo => {
      if (todo.id === curentTodoId) {
        todo.completed = completedTodo;
      }

      return todo;
    });

    await updateTodoCompleted(curentTodoId, completedTodo)
      .then(() => {
        setTodos(filterTodo);
      })
      .catch(() => setHasLoadError('Unable to completed a todo'));
  };

  const handleToggleAll = () => {
    setToggleAll(!toggleAll);

    const filterTodo = todos.map(todo => {
      todo.completed = !completedTodo;

      return todo;
    });

    const chooseCompletep = () => ([...todos].forEach(todo => {
      updateTodoCompleted(todo.id, !completedTodo)
        .then(() => {
          setTodos(filterTodo);
        })
        .catch(() => setHasLoadError('Unable to completed a todo'));
    }));

    chooseCompletep();
    setCompletedTodo(!completedTodo);
  };

  const handleUpdateTodo = async (event: FormEvent, curentTodoId: number) => {
    event.preventDefault();

    const filterTodo = todos.map(todo => {
      if (todo.id === curentTodoId) {
        todo.title = changTitle;
      }

      return todo;
    });

    await updateTodoTitle(curentTodoId, changTitle)
      .then(() => {
        setTodos(filterTodo);
      })
      .catch(() => setHasLoadError('Unable to update a todo'));

    setChangTitle('');
  };

  const filterTodos = todos
    ? todos.filter(todo => {
      switch (statusFilter) {
        case FilterStatus.Completed:

          return todo.completed;
        case FilterStatus.Active:

          return !todo.completed;

        default:
          return todo;
      }
    })
    : null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          newTitleTodo={newTitleTodo}
          handleTitleTodo={setNewTitleTodo}
          handleAddTodo={handleAddTodo}
          isAdding={isAdding}
          handleToggleAll={handleToggleAll}
          toggleAll={toggleAll}
        />
        <TodoList
          todos={filterTodos}
          handleDeleteTodo={handleDeleteTodo}
          changTitle={changTitle}
          setChangTitle={setChangTitle}
          handleChangeCompleted={handleChangeCompleted}
          isAdding={isAdding}
          handleUpdateTodo={handleUpdateTodo}
        />
        {todos.length !== 0 && (
          <TodoFilter
            todos={todos}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
        {hasLoadError && (
          <ErrorNotification
            hasLoadError={hasLoadError}
            setHasLoadError={setHasLoadError}
          />
        )}
      </div>
    </div>
  );
};
