# Seeder-SDK

A SDK for microservices

## Dependencies

|      Tool     | Version | 
|      :-:      |    :-:  | 
|   Express.js  |  4.16.3 | 
|  Body Parser  |  1.18.3 | 
|    Winston    |   3.0.0 | 
|    Morgan     |   1.9.0 |
|  node-couchdb |   1.3.0 |
|     cors      |   2.8.4 |
|      joi      |  13.4.0 |
|     split     |   1.0.1 |


## Usage

The recommended way to use this tools inside a project is importing directly from sdk

> Importing specific module
```js 
import { logger } from 'seed-sdk'

logger.info('This is the seed-sdk')
```
Or: 
```js
import seedSdk from 'seed-sdk'

const logger = seedSdk.logger

logger.info('Another way to use')
```

## Table of contents

* [Express](#express)
* [app](#app)  
  * [Function format](#function-format)
  * [Usage](#app-usage)




## Express

You can use express as the same way the original framework [Express](https://github.com/expressjs/express) is used, but the [`app`](#app) already has his own initialization with the SDK configuration.   
You can use more to use the Router 