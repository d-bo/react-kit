# react-kit

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bc054a78be184800beaff7910cffdc99)](https://app.codacy.com/app/d-bo/react-kit?utm_source=github.com&utm_medium=referral&utm_content=d-bo/react-kit&utm_campaign=Badge_Grade_Dashboard)
[![CircleCI](https://circleci.com/gh/d-bo/react-kit/tree/dev.svg?style=svg)](https://circleci.com/gh/d-bo/react-kit/tree/dev)
[![Build Status](https://travis-ci.com/d-bo/react-kit.svg?branch=dev)](https://travis-ci.com/d-bo/react-kit)

## Firebase

Install firebase locally after ```npm install```.

```sh
npm install firebase --force
```

Enter firebase console.

[https://console.firebase.google.com/](https://console.firebase.google.com/)

Export firebase secrets to local environment variables.

```bash
#!/bin/sh
# cloud/local environment variables
export REACT_APP_FIREBASE_API_KEY=""
export REACT_APP_FIREBASE_AUTH_DOMAIN=""
export REACT_APP_FIREBASE_DATABASE_URL=""
export REACT_APP_FIREBASE_PROJECT_ID=""
export REACT_APP_FIREBASE_STORAGE_BUCKET=""
export REACT_APP_FIREBASE_MESSAGING_SENDER_ID=""
```

## Docker

We need to pass firebase environment vars to running container.

Create file ```env.list``` in the root of your project.

Paste and fill this:

```sh
REACT_APP_FIREBASE_DATABASE_URL=
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_STORAGE_BUCKET=
```

Build and run container.

```bash
# Testing build from sources inside container
docker build -t react-kit .
docker run --env-file ./env.list -itp 80:80 react-kit
# TODO: put prod-ready build under the nginx folder
# Is there an nginx fat-free version ?
```
