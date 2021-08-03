[![.github/workflows/deploy.yml](https://github.com/workshopbutler/js-widgets/actions/workflows/deploy.yml/badge.svg)](https://github.com/workshopbutler/js-widgets/actions/workflows/deploy.yml)

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
3. Install all dependencies via `npm i`

## Launch and Build
`API_KEY=[your API key] npm run dev`

It is possible to use special `API_KEY=mock` that will replace default API transport with local mock data.

This command launches a webserver on `http://localhost:8080`.

* Open `http://localhost:8080/schedule` for the list of all events
* Open `http://localhost:8080/trainers` for the list of all trainers
* Open `http://localhost:8080/testimonials` for the list of testimonials

To compile a theme, use `npm run build`. The compiled files are in `dist/` directory.

## Configuration
`package.json -> version`

Contains a version number, used in `widgets.[version].js`
