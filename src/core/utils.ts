import { ToastPosition } from "./types";

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const getRelatedToast = (position: ToastPosition) => {
  const portal = document.querySelector("#toast-it-portal") as HTMLElement;
  if (!portal) return { toasts: [], lastToast: null, length: 0 };
  const toasts = Array.from(portal.children).filter((child) => child.getAttribute("data-toast-position") === position) as HTMLElement[];
  return { toasts, lastToast: toasts[toasts.length - 1], length: toasts.length };
};

export const calculateOffset = ({ gutter, position }: { gutter: number; position?: ToastPosition }) => {
  const toastPosition: ToastPosition = position || "bottom-right";
  const { lastToast, length } = getRelatedToast(toastPosition);
  return lastToast ? (lastToast.clientHeight + gutter) * length : 0;
};

export const updateToastPosition = ({ gutter, position, height }: { gutter: number; position: ToastPosition; height: number }) => {
  const { toasts, length } = getRelatedToast(position);

  toasts.forEach((toast, index) => {
    let offset = calculateOffset({ position, gutter: 8 });

    if (length === 1) {
      toast.style.transform = "translateY(0px)";
    } else {
      const newClientHeight = (height + gutter) * index;
      offset = index === 0 ? 0 : newClientHeight;
      toast.style.transform = position.includes("top") ? `translateY(${offset}px)` : `translateY(-${offset}px)`;
    }
  });
};
