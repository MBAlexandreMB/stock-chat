To run stock-chat app, you'll need installed:
  - NPM (https://www.npmjs.com/get-npm)
  - rabbitmq-server (https://www.rabbitmq.com/download.html)
  - mongoDB (https://www.mongodb.com/download-center/community)

This project uses dotenv. Variables must not be quoted!

  VARIABLE                                    (example)
  ------------------------------------------------------------------------------
  - PORT: 'number'                         |  (3000)
  - MONGODB_URI: 'mongodb connection url'  |  (mongodb://host-name/database-name)
  - SESSION_SECRET: 'cookie secret string' |  (chat-app)
  - RABBITMQ_AMPQ: 'ampq "url" string'     |  (amqp://localhost)
  ------------------------------------------------------------------------------

Install npm dependencies:
  - npm i

With rabbitmq-server and mongoDB server up and running:
  - node start

To see the bot, run:
  - npm run bot

To see the test of one of the functions:
  - npm run test