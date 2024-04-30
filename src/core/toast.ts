import { ToastType, ToastOptions, Toast, ToastHandler } from "./types";
import { calculateOffset, generateId } from "./utils";
import { createToastElement, handleToastDismiss } from "../components/toaster";

const defaultOptions = {
  position: "bottom-right",
  duration: 3000,
  autoClose: true,
  gutter: 8,
} as const;

class ToastIt {
  options: ToastOptions;
  activeToasts: Toast[] = [];

  constructor(options?: ToastOptions) {
    this.options = options || defaultOptions;
  }

  private createToast = (message: string, type: ToastType = "blank", opts?: ToastOptions): Toast => ({
    createdAt: Date.now(),
    type,
    message,
    id: opts?.id || this.options.id || generateId(),
    position: opts?.position || this.options.position,
    duration: opts?.duration || this.options.duration,
    autoClose: opts?.autoClose || this.options.autoClose,
    gutter: opts?.gutter || this.options.gutter,
    ...opts,
  });

  private createHandler =
    (type?: ToastType): ToastHandler =>
    (message, opts) => {
      let portal: HTMLElement | null = document.querySelector("#toast-it-portal");
      if (!portal) {
        portal = document.createElement("div");
        document.body.appendChild(portal);
      }

      const offset = calculateOffset({
        gutter: opts?.gutter || defaultOptions.gutter || 8,
        position: opts?.position,
      });

      const toast = this.createToast(message, type, opts);
      const toastElement = createToastElement(toast, offset);

      portal.id = "toast-it-portal";
      portal.style.cssText = `position:fixed;z-index:9999;top:16px;left:16px;right:16px;bottom:16px;pointer-events:none;`;

      portal.appendChild(toastElement);

      return toast.id;
    };

  open = ({ message, type = "blank", ...opts }: { message: string; type?: ToastType } & ToastOptions) =>
    this.createHandler(type)(message, opts);

  success = this.createHandler("success");
  error = this.createHandler("error");

  dismiss = (id?: string) => {
    const portal = document.querySelector("#toast-it-portal");
    if (!portal) return;

    if (id) {
      handleToastDismiss(id, this.options.gutter || defaultOptions.gutter);
    } else {
      const toasts = Array.from(portal.children) as HTMLElement[];
      toasts.forEach((toast) => {
        const toastId = toast.getAttribute("data-toast-id");
        if (toastId) {
          handleToastDismiss(toastId, this.options.gutter || defaultOptions.gutter);
        }
      });
    }
  };

  config = (opts: ToastOptions) => {
    Object.assign(this.options, opts);
    return this.options;
  };
}

export default ToastIt;
