# Toast it

Toast notifications with a simple and easy-to-use.

## Installation

#### Adding toast-it via NPM.

```bash
npm install @dhafitf/toast-it
```

or

```bash
yarn add @dhafitf/toast-it
```

#### Adding toast-it via CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/@dhafitf/toast-it/dist/toast-it.umd.min.js"></script>
```

> Files are delivered via the CDN service provided by [jsdelivr](https://www.jsdelivr.com/).

## Basic Usage

Add a toast to page. The toast will be appended to the body element.

```js
const toast = new ToastIt();

const notifyButton = document.getElementById("notify-btn");
notifyButton.addEventListener("click", () => {
  toast.success("Hello, World!");
});
```

## Documentation

Calling the `ToastIt` constructor will create a new instance of the toast notification. The constructor accepts an optional configuration object. This will be used to set the default options for the toast.

```js
const toast = new ToastIt({
  // Will auto close the toast after the duration. Set to false to disable
  autoClose: true,
  // Duration of the toast to be visible. Not applicable if autoClose is false
  duration: 5000,
  // Position of the toast
  position: "bottom-right",
  // Space between toasts
  gutter: 8,
});
```

### Creating a toast

#### Success

```js
toast.success("Hello, World!");
```

Creates a notification with an animated checkmark.

#### Error

```js
toast.error("Hello, World!");
```

Creates a notification with an animated error icon.

#### Blank

```js
toast.open({
  type: "blank", // You can also use "success" or "error"
  message: "Hello, World!",
});
```

#### With options

A toast can be created with options properties to override the default options.

```js
toast.success("Hello, World!", {
  duration: 3000,
  position: "top-left",
});
```

or

```js
toast.open({
  type: "success",
  message: "Hello, World!",
  duration: 3000,
  position: "top-left",
});
```

### Utilities

#### Dismiss Toasts Programatically

You can manually dismiss a notification with `toast.dismiss`. Toasts will auto-remove after 3 second by default.

##### Dismiss a single toast

```js
// Generate a random id for the toast
const toastId = Math.random().toString(36).substring(2, 9);

const showButton = document.getElementById("show");
showButton.addEventListener("click", () => {
  toast.success("Hello World!", {
    id: toastId, // Set the id of the toast
    autoClose: false,
    position: "top-right",
  });
});

const dismissButton = document.getElementById("dismiss");
dismissButton.addEventListener("click", () => {
  toast.dismiss(toastId); // Dismiss the toast with the given id
});
```

##### Dismiss all toasts

```js
toast.dismiss();
```

## Acknowledgements

This project is inspired by

- [React Hot Toast](https://github.com/timolins/react-hot-toast)
