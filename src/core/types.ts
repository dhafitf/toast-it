export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

export type ToastType = "blank" | "success" | "error";

export type Renderable = HTMLElement | string | null;

export interface Toast {
  type: ToastType;
  id: string;
  message: string;
  gutter?: number;
  position?: ToastPosition;
  duration?: number;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  autoClose?: boolean;
  icon?: Renderable;
  createdAt: number;
}

export type ToastOptions = Partial<Pick<Toast, "id" | "duration" | "className" | "style" | "position" | "autoClose" | "gutter">>;

export type ToastHandler = (message: string, options?: ToastOptions) => string;
