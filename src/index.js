import { h, createSignal, useEffect, render, For } from "./core";
import "./style.css";

// import { render } from "solid-js/web";
// import h from "solid-js/h";
// import { createSignal } from "solid-js";

// function Button(props) {
//   return h("button.btn-primary", props)
// }

// function Counter() {
//   const [count, setCount] = createSignal(0);
//   const increment = (e) => setCount(c => c + 1);

//   return h(Button, { type: "button", style: { color: "red" }, onClick: increment }, count);
// }

function TextInput(props) {
  const wrapper = () => h("div", { class: "flex" });

  // const onInput = (e) => setValue((c) => e.target.value);

  return h(wrapper, {}, [
    () =>
      h(
        "input",
        {
          onInput: props.onInput,
          class: "border border-gray-300 rounded-md m-1",
          value: props.value,
        },
        []
      ),
    // () => h("div", { class: "font-bold" }, [value]),
  ]);
}

const Button = (props) => {
  return h(
    "button",
    {
      class:
        "border bg-white border-gray-300 cursor-pointer rounded-md px-2 m-1",
      type: props.type,
      onClick: props.onClick,
    },
    [props.text]
  );
};

const createRowForm = (props) => {
  const [inputValue, setInputValue] = createSignal("");

  let localInputValue = "";
  const onInput = (e) => {
    localInputValue = e.target.value;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!localInputValue) return
    props.onCreate(localInputValue);
    localInputValue = ''
    setInputValue(() => "");
  };

  return h(
    "form",
    {
      class: "bg-slate-100 p-4 my-4 flex border-gray-300 rounded-md",
      style: { width: "400px" },
      onSubmit,
    },
    [
      TextInput({ value: inputValue, onInput }),
      Button({ text: "Внести", type: "submit" }),
    ]
  );
};

// function App() {
//   const [items, setItems] = createSignal([
//     { id: 1, text: "Изучить Solid.js" },
//     { id: 2, text: "Создать приложение" },
//     { id: 3, text: "Поделиться опытом" }
//   ]);

//   return h('div', {}, [
//     h('h1', {}, "Мой список задач"),
//     h('ul', {},
//       h(For, {
//         each: items(),
//         children: (item) => h('li', {}, item.text)
//       })
//     )
//   ]);
// }

const List = () => {
  const [items, setItems] = createSignal(["asd"]);

  const onCreate = (val) => {
    setItems((v) => [...v, val]);
  };

  const onRemove = (ind) => {
    setItems((v) => {
      return v.toSpliced(ind, 1);
    })
  };

  return h("div", { class: "mx-4" }, [
    createRowForm({ onCreate }),
    h(For, {
      each: items,
      children: (item, ind) =>
        h("li", {}, [
          item,
          h("span", { class: "ml-2 p-2 cursor-pointer", onClick: () => onRemove(ind) }, ["x"]),
        ]),
    }),
  ]);
};

render(() => List(), document.getElementById("app"));
