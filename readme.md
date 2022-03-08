# Student Reports


## What does this do?
This lets teachers add students and automatically send an email report to the students parent.
[![https://imgur.com/y3joKe7.png](https://imgur.com/y3joKe7.png)](https://imgur.com/y3joKe7.png)
[![https://imgur.com/cJxhqEh.png](https://imgur.com/cJxhqEh.png)](https://imgur.com/cJxhqEh.png)
[![https://imgur.com/3nYi933.png](https://imgur.com/3nYi933.png)](https://imgur.com/3nYi933.png)
[![https://imgur.com/bzHcFik.png](https://imgur.com/bzHcFik.png)](https://imgur.com/bzHcFik.png)

## How is it made?
This is made using Svelte on the front end and NodeJS with Express on the back end.

## How to deploy
1. Make a .env file in the base directory
1. Inside the .env file put this: 
```
DATABASE_URL={YOUR MONGODB URL HERE}
EMAIL_USER={YOUR GMAIL USERNAME HERE}
EMAIL_PASS={YOUR GMAIL PASSWORD HERE}
```
3. Go to https://myaccount.google.com/lesssecureapps and allow less secure apps
1. Run `npm i` to install dependencies
1. Run `npm start` to start the server
1. Open a new terminal and navigate to the `front_end` folder
1. Run `npm i` to install the front end dependencies
1. Run `npm run start` to serve the app or run `npm run build` to build the app to deploy somewhere else
1. Edit `config.json` inside `/front_end/public/` and enter your backed URL WITHOUT a slash after and your email for sending test emails
Your config.json will look something like this
```json
{
	"url": "https://your_url:3000/students",
	"yourEmail": "example@gmail.com"
}

```
