[![Build Status](https://travis-ci.org/workshopbutler/js-widgets.svg?branch=master)](https://travis-ci.org/workshopbutler/js-widgets)

# Workshop Butler JS Widgets

A set of Javascript widgets to integrate any website with Workshop Butler. 

* EventList widget renders the list of workshops
* EventPage widget renders the details of one event
* TrainerList widget renders the list of trainers
* TrainerPage widget renders the profile of a trainer
* RegistrationPage widget renders a registration form for an event
* SidebarEventList widget renders the list of events, designed specifically for sidebars and columns
* TestimonialList widget renders the list of endorsements for one trainer

The widgets work with [default themes](https://workshopbutler.com/developers/themes/). If you want to customise
the look, check the themes. The widgets render the pages using the templates, provided by a theme, and 
apply an additional logic. 

If you have a WordPress website, we recommend using our [WordPress plugin](https://github.com/workshopbutler/wordpress-plugin).

## Set up
1. Clone or fork this repo
2. Login to [Workshop Butler](https://workshopbutler.com), open *Account Settings* -> *API*, activate it and 
copy an API key for your account
3. Retrieve all dependences via `npm i`  

## Launch and Build
`API_KEY=[your API key] npm run watch`

This command launches a webserver on `http://localhost:8081`. 

* Open `http://localhost:8081/schedule.html` for the list of all events
* Open `http://localhost:8081/trainer-list.html` for the list of all trainers

To compile a theme, use `npm run build`. The compiled files are in `dist/` directory.       

## Configuration
`package.json -> version`

Contains a version number, used in `widgets.[version].js`

`config.js -> options -> theme`

Name of an active theme. For default themes, use these values: `alfred`, `dacota`, `britton`, `gatsby`, `hayes`.

## Compatibility

Starting version 1.0.0, the versions for JS widgets and themes are sync. If you use a version 1.1.0 for widgets, 
you must use version 1.1.0 for themes. 

JS widgets | Themes  
-------------- | --------------------------
0.9.0 | 0.5.3
0.7.0 | 0.5.3
0.6.0 | 0.5.1 
0.5.0 | 0.5.1 
0.4.0 | 0.4.0 
