This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

## understanding the code structure of next (server + client)
the client and the server are on the same folder level, what I mean is this for example my server component will look like this,
```
# server
models
  user.js
  ...
controllers
  auth-controller.js
  ...
routes
  auth-routes.js
  ...
utils
  middleware.js
  config.js
  appError.js - special error constructor that expands the normal Error class
helpers
  catchAsync.js
  globalErrorController.js
  ...
server.js
app.js
.env
```

```
# client
public
  assets
  next.svg
  ...
src
  app
  components
  pages
    /api
      /auth
        [...nextauth].js
        register.js
```

```
# combined
/src
  /app
  /components
  /pages
    /api
      /auth
        [...nextauth].js
        register.js
  /utils
    config.js
    middleware.js
  /lib
    mongodb.js
  /models
    user.js
    ...
```
the idea is that the normal server folders and the client folders are all in the `/src` directory

## create the google api secret etc
- go to google cloud console
- create a new project, if you like
- click on api and services
- navigate to oauth consent screen
  enter email address and info about user, otherwise pretty much leave everything as is (default)
- click on credentials in the same sidebar where I saw the oauth consent screen, at the top of  the page u will see create credentials,
- click on oauth client id
- select web application for the application type
-  
