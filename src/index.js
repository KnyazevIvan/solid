import { style } from "solid-js/web";
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


let effect = null;


const useEffect = (cb) => {
  effect = cb
  effect()
  effect = null;
}


const h = (type, props, children) => {
  const el = typeof type === 'function' ? type(props) : document.createElement(type);

  for (const prop in props) {
    if (prop === "style") {
      for (const style in props.style) {
        el.style[style] = props.style[style];
      }
    } else if(prop === 'class') {
      for(const cs of props[prop].split(' ')) {
        el.classList.add(cs)
      }
    } else if (prop.startsWith('on')) {
      el.addEventListener(prop.replace('on', '').toLowerCase(), props[prop])
    } else {
      el[prop] = props[prop];
    }
  }

  if (!children) return el


  children.forEach(child => {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child));
    } else if (typeof child === "function") {

      const res = child();
      if (res instanceof Node) {
        el.appendChild(res);
      } else {
        useEffect(() => {
          el.innerHTML = child()
        })
      }
    } else {
      el.appendChild(child);
    }
  });
  return el;
}


const render = (component, target) => {
  const el = component();
  target.appendChild(el);
}



function createSignal(raw) {
  const effects = new Set();

  const state = {
    value: raw
  }

  const getter = () => {
    if (effect) {
      effects.add(effect);
      effect = null;
    }
    return state.value
  }

  const setter = (cb) => {
    state.value = cb(state.value)
    effects.forEach(e => {
      e()
    })
  }

  return [getter, setter]
}


function Button(props) {
  return h("button", props)
}

function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = (e) => setCount(c => c + 1);

  return h(Button, { type: "button", style: { color: "red" }, onClick: increment }, [count]);
}


function TextInput() {
  const wrapper = (props) => h('div', props)

  const [value, setValue] = createSignal('');
  const onInput = (e) => setValue(c => e.target.value);


  return h(wrapper, { value }, [
    () => h('input', { onInput }), 
    () => h('div', {}, [value])])
}

render(() => h('div', { class: 'flex grey p-4', style: { width: '400px' } }, [Counter, TextInput]), document.getElementById("app"));
