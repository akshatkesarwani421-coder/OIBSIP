# To-Do App

A simple to-do list app built with HTML, CSS, and JavaScript. It has a dark interface and keeps tasks saved in the browser.

## Features

- Add tasks using the button or Enter key
- View pending and completed tasks with counters
- Complete or undo tasks
- Edit, save, or cancel task changes
- Delete tasks
- See when tasks were added and completed
- Keep tasks after refreshing the page using `localStorage`

## How to Run

Open `index.html` in a web browser. You can also use the VS Code Live Server extension.

## What I Learned

The UI is rendered from the `tasks` array, which keeps the app's data as the source of truth. User task text is inserted with `textContent` to avoid treating it as HTML, and tasks are saved in `localStorage` so they remain after a refresh.

