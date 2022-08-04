import React, {
  useCallback,
  useReducer,
  createContext,
  useContext,
  PropsWithChildren,
  FC,
} from "react";

interface Todo {
  id: number;
  done: boolean;
  text: string;
}
type ActionType =
  | { type: "ADD"; text: string }
  | { type: "REMOVE"; id: number };

type useTodosManagerResult = ReturnType<typeof useTodosManager>;

const TodoContext = createContext<useTodosManagerResult>({
  todos: [],
  addTodo: () => {},
  removeTodo: () => {},
});

const useTodosManager = (
  initialTodo: Todo[]
): {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: number) => void;
} => {
  const [todos, dispatch] = useReducer((state: Todo[], action: ActionType) => {
    switch (action.type) {
      case "ADD":
        return [
          ...state,
          {
            id: state.length,
            text: action.text,
            done: false,
          },
        ];
      case "REMOVE":
        return state.filter((todo) => todo.id !== action.id);
      default:
        return state;
    }
  }, initialTodo);

  const addTodo = useCallback((text: string) => {
    dispatch({ type: "ADD", text });
  }, []);

  const removeTodo = useCallback((id: number) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  return { todos, addTodo, removeTodo };
};

export const TodosProvider: FC<
  PropsWithChildren & {
    initialTodos: Todo[];
  }
> = ({ initialTodos, children }) => {
  return (
    <TodoContext.Provider value={useTodosManager(initialTodos)}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): Todo[] => {
  const { todos } = useContext(TodoContext);
  return todos;
};

export const useAddTodo = (): useTodosManagerResult["addTodo"] => {
  const { addTodo } = useContext(TodoContext);
  return addTodo;
};
export const useRemoveTodo = (): useTodosManagerResult["removeTodo"] => {
  const { removeTodo } = useContext(TodoContext);
  return removeTodo;
};
