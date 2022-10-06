import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[] | null;
  statusFilter: string;
  setStatusFilter: (event: string) => void;
  handleClearCompleted: () => void;
}

export const TodoFilter: React.FC<Props> = ({
  todos,
  setStatusFilter,
  statusFilter,
  handleClearCompleted,
}) => {
  const findTodoCompleted = todos?.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {todos && (
          `${todos.length} items left`
        )}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { 'filter__link selected': statusFilter === FilterStatus.All },
          )}
          onClick={() => setStatusFilter(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { 'filter__link selected': statusFilter === FilterStatus.Active },
          )}
          onClick={() => setStatusFilter(FilterStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              'filter__link selected':
              statusFilter === FilterStatus.Completed,
            },
          )}
          onClick={() => setStatusFilter(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>
      <div>
        {findTodoCompleted && (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>
    </footer>
  );
};