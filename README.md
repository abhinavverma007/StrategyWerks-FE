# MyAngularApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.13.

## Description and features

Problem statement: The task was to implement infinite scrolling(in angular or react) with a backend server which supporting filtering and pagination (of user's choice).

1. The opening page shows multiple cards present in list form.
2. 10,000 items are to be presented with dynamic data loading.
3. Responsive design for Laptop,Ipad,Mobile screens. (All screens)
4. Documentation added in methods in component.
5. Test cases added and keyboard accessbility with tabIndex and screen reader accessibility with aria roles
   provided.

## Pre-requisites

1. You must have node in your system.
2. You must have nvm(node version manager) installed.
   We are using node version 16.16.0.
   After installing nvm, you can type `nvm install 16.16.0` to install this version
   Then type `nvm use 16.16.0`

## Steps to run the application

1. Run `npm install` in terminal
2. Make `.env` file at root level ( parallel to package.json)
3. Add the `API_URL` (eg: API_URL=http://localhost:3000) in your `.env` file. It is URL of your backend server.
4. Now run `npm run start` in terminal
5. After successful, compilation, go to http://localhost:4200

### Steps to test/check code coverage the application

1. Run `npm run test` in terminal
2. `coverage` folder will be generated at root level. You can check
   from there by opening `index.html` file present in there.
