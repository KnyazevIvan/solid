export const render = (component, target) => {
  const el = component();
  target.appendChild(el);
};

export const For = (props) => {
    const el = document.createElement('div');
    useEffect(() => {
        el.innerHTML = '';
        props.each().forEach((child, ind) => {
            el.appendChild(props.children(child, ind))
        })
    })
 
    return el;
};

export const h = (type, props, children) => {
  if (type === For) {
    return For(props);
  } else {
    const el =
      typeof type === "function" ? type(props) : document.createElement(type);

    for (const prop in props) {
      if (prop === "style") {
        for (const style in props.style) {
          el.style[style] = props.style[style];
        }
      } else if (prop === "class") {
        for (const cs of props[prop].split(" ")) {
          el.classList.add(cs);
        }
      } else if (prop.startsWith("on")) {
        el.addEventListener(prop.replace("on", "").toLowerCase(), props[prop]);
      } else if (typeof props[prop] === "function") {
        useEffect(() => {
          el[prop] = props[prop]();
        });
      } else {
        el[prop] = props[prop];
      }
    }

    if (!children) return el;

    children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else if (typeof child === "function") {
        const res = child();
        if (res instanceof Node) {
          el.appendChild(res);
        } else {
          useEffect(() => {
            el.innerHTML = child();
          });
        }
      } else {
        if (Array.isArray(child)) {
          for (const c of child) {
            el.appendChild(c);
          }
        } else {
            el.appendChild(child);
        }
      }
    });
    return el;
  }
};

let effect = null;

export const useEffect = (cb) => {
  effect = cb;
  effect();
  effect = null;
};

export function createSignal(raw) {
  const effects = new Set();

  const state = {
    value: raw,
  };

  const getter = () => {
    if (effect) {
      effects.add(effect);
      effect = null;
    }
    return state.value;
  };

  const setter = (cb) => {
    state.value = cb(state.value);
    effects.forEach((e) => {
      e();
    });
  };

  return [getter, setter];
}
