import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import "./App.css";

const Heading = ({ title }: { title: string }) => {
  return <h2>{title}</h2>;
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

interface Payload {
  text: string;
}

const App = () => {
  const onListClick = useCallback((item: string) => {
    alert(item);
  }, []);

  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setPayload(data));
  }, []);
  return (
    <div>
      <Heading title="Introduction" />
      <Box>
        <p>Hello there</p>
      </Box>
      <List items={["one", "two", "three"]} onClick={onListClick} />
      <Box>{JSON.stringify(payload)}</Box>
    </div>
  );
};

export default App;
