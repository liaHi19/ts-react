import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useTodos, useAddTodo, useRemoveTodo, TodosProvider } from "./useTodos";
import "./App.css";

const Heading = ({ title }: { title: string }) => {
  return <h2>{title}</h2>;
};

const Button: FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    title?: string;
  }
> = ({ title, children, style, ...rest }) => {
  return (
    <button
      {...rest}
      style={{ ...style, backgroundColor: "black", color: "white" }}
    >
      {title ?? children}
    </button>
  );
};

const Box: FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

const List: FC<{ items: string[]; onClick?: (item: string) => void }> = ({
  items,
  onClick,
}) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={index}
          onClick={() => {
            onClick?.(item);
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

const useNumber = (initialValue: number) => useState<number>(initialValue);
type UseNumberValue = ReturnType<typeof useNumber>[0];
type UseSetNumberValue = ReturnType<typeof useNumber>[1];

const Incrementor: FC<{
  value: UseNumberValue;
  setValue: UseSetNumberValue;
}> = ({ value, setValue }) => {
  return (
    <Button
      onClick={() => {
        setValue((prev) => prev + 1);
      }}
      title={`Add - ${value}`}
    />
  );
};

// const Incrementor: FC<{
//   value: number;
//   setValue: React.Dispatch<React.SetStateAction<number>>;
// }> = ({ value, setValue }) => {
//   return (
//     <button
//       onClick={() => {
//         setValue((prev) => prev + 1);
//       }}
//     >
//       Add - {value}
//     </button>
//   );
// };

interface Payload {
  text: string;
}

function UL<T>({
  items,
  render,
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
> & {
  items: T[];
  render: (item: T) => React.ReactNode;
}) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{render(item)}</li>
      ))}
    </ul>
  );
}

const App = () => {
  const todos = useTodos();
  const addTodo = useAddTodo();
  const removeTodo = useRemoveTodo();

  const onListClick = useCallback((item: string) => {
    alert(item);
  }, []);

  const [payload, setPayload] = useState<Payload | null>(null);
  const [value, setValue] = useNumber(0);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setPayload(data));
  }, []);

  const newTodoRef = useRef<HTMLInputElement | null>(null);

  const onAddTodo = useCallback(() => {
    if (newTodoRef.current) {
      addTodo(newTodoRef.current.value);
      newTodoRef.current.value = "";
    }
  }, [addTodo]);

  return (
    <div>
      <Heading title="Introduction" />
      <Box>
        <p>Hello there</p>
      </Box>
      <List items={["one", "two", "three"]} onClick={onListClick} />
      <Box>{JSON.stringify(payload)}</Box>

      <Incrementor value={value} setValue={setValue} />

      <Heading title="Todos" />
      <UL
        items={todos}
        render={(todo) => (
          <>
            {todo.text}
            <button
              onClick={() => {
                removeTodo(todo.id);
              }}
            >
              Remove
            </button>
          </>
        )}
      />
      {/* <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button
              onClick={() => {
                removeTodo(todo.id);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul> */}
      <div>
        <input type="text" ref={newTodoRef} />
        <button onClick={onAddTodo}>Add Todo</button>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <TodosProvider initialTodos={[]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        <App />
        <App />
      </div>
    </TodosProvider>
  );
};

export default AppWrapper;
