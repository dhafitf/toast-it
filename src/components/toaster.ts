import { css, keyframes } from "goober";
import { CheckmarkIcon } from "./checkmark";
import { ErrorIcon } from "./error";
import { Renderable, Toast, ToastPosition, ToastType } from "../core/types";
import { updateToastPosition } from "../core/utils";

const container = css`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  width: fit-content;
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  will-change: transform;
`;

const message = css`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  white-space: pre-line;
  margin: 4px 10px;
`;

const activeClass = css`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;

const enterAnimation = (factor: number) => `
0% {transform: translate3d(0,${factor * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;

const exitAnimation = (factor: number) => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${factor * -200}%,-1px) scale(.6); opacity:0;}
`;

const getAnimationStyle = (position: ToastPosition, visible: boolean): Partial<CSSStyleDeclaration> => {
  const top = position.includes("top");
  const factor = top ? 1 : -1;

  const [enter, exit] = [enterAnimation(factor), exitAnimation(factor)];

  return {
    animation: visible
      ? `${keyframes(enter)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`
      : `${keyframes(exit)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`,
  };
};

const getPositionStyle = (position: ToastPosition): Partial<CSSStyleDeclaration> => {
  const top = position.includes("top");
  const verticalStyle: Partial<CSSStyleDeclaration> = top ? { top: "0" } : { bottom: "0" };
  const horizontalStyle: Partial<CSSStyleDeclaration> = position.includes("center")
    ? {
        justifyContent: "center",
      }
    : position.includes("right")
    ? {
        justifyContent: "flex-end",
      }
    : {};
  return {
    left: "0",
    right: "0",
    display: "flex",
    position: "absolute",
    transition: `all 230ms cubic-bezier(.21,1.02,.73,1)`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

const getIcon = (type: ToastType, icon?: Renderable): HTMLElement | null => {
  switch (type) {
    case "success":
      return CheckmarkIcon.cloneNode(true) as HTMLElement;
    case "error":
      return ErrorIcon.cloneNode(true) as HTMLElement;
    default:
      if (icon) {
        const element = document.createElement("div");
        if (typeof icon === "string") {
          element.innerHTML = icon;
        } else {
          element.appendChild(icon);
        }

        return element;
      }

      return null;
  }
};

export const handleToastDismiss = (id: string, gutter: number) => {
  const toast = document.querySelector(`[data-toast-id="${id}"]`) as HTMLElement;
  if (!toast) return;

  const height = toast.clientHeight;
  const toastPosition = toast.getAttribute("data-toast-position") as ToastPosition;

  const newAnimationStyle = getAnimationStyle(toastPosition, false);
  Object.assign(toast.style, newAnimationStyle);

  setTimeout(() => {
    toast.remove();
    updateToastPosition({
      height,
      position: toastPosition,
      gutter: gutter,
    });
  }, 100);
};

export const createToastElement = (toast: Toast, offset: number) => {
  const toastPosition: ToastPosition = toast.position || "bottom-right";
  const animationStyle = getAnimationStyle(toastPosition, true);
  const positionStyle = getPositionStyle(toastPosition);

  const Container = document.createElement("div");
  Container.className = container;

  Object.assign(Container.style, animationStyle, toast.style);

  const Message = document.createElement("div");
  Message.className = message;
  Message.textContent = toast.message;

  const Icon = getIcon(toast.type, toast.icon);
  if (Icon) {
    Container.appendChild(Icon);
  }

  Container.appendChild(Message);

  const Wrapper = document.createElement("div");
  Wrapper.setAttribute("data-toast-position", toastPosition);
  Wrapper.setAttribute("data-toast-id", toast.id);
  Wrapper.className = activeClass;

  Wrapper.style.transform = toast.position?.includes("top") ? `translateY(${offset}px)` : `translateY(-${offset}px)`;

  Object.assign(Wrapper.style, positionStyle);
  Wrapper.appendChild(Container);

  if (toast.autoClose) {
    setTimeout(() => {
      handleToastDismiss(toast.id, toast.gutter || 8);
    }, toast.duration);
  }

  return Wrapper;
};
