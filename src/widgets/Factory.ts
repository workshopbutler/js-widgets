import {logError} from '../common/Error';
import EventList from "./EventList";
import EventPage from "./EventPage";
import TrainerPage from "./TrainerPage";
import RegistrationPage from "./RegistrationPage";
import TrainerList from "./TrainerList";
import SidebarEventList from "./SidebarEventList";
import Templates from "../../themes/src/Templates";
import {ITemplates} from "../templates/ITemplates";

export default class WidgetFactory {

    /**
     * @param widget {object}
     * @param widget.type {string} Type of the widget
     * @param widget.target {string} DOM element to assign the widget to
     * @param apiKey {string}
     * @param index {number} Index for logging
     * @param templates {ITemplates} Templates for widgets
     * @private
     */
    createWidget(widget: any, index: number, apiKey: string, templates: ITemplates) {
        const supportedWidgets = ['EventList', 'EventPage', 'RegistrationPage', 'TrainerPage', 'TrainerList', 'SidebarEventList'];
        if (!widget.type || supportedWidgets.indexOf(widget.type) < 0) {
            logError(`Unknown widget type at the index ${index}`);
            return false;
        }
        if (!widget.target || typeof widget.target !== 'string') {
            logError(`Incorrect [target] attribute for the widget ${widget.type}`);
            return false;
        }
        switch(widget.type) {
            case 'EventList':
                EventList.plugin(widget.target, apiKey, templates, widget);
                return true;
            case 'EventPage':
                EventPage.plugin(widget.target, apiKey, templates, widget);
                return true;
            case 'RegistrationPage':
                RegistrationPage.plugin(widget.target, apiKey, templates, widget);
                return true;
            case 'TrainerPage':
                TrainerPage.plugin(widget.target, apiKey, templates, widget);
                return true;
            case 'TrainerList':
                TrainerList.plugin(widget.target, apiKey, templates, widget);
                return true;
            case 'SidebarEventList':
                SidebarEventList.plugin(widget.target, apiKey, templates, widget);
                return true;
            default:
                logError(`Unknown widget type at the index ${index}`);
                return false;
        }
    }

    static getDefaultTemplates() {
        return new Templates();
    }

    /**
     * Create the set of Workshop Butler widgets
     * @param apiKey {string}
     * @param widgets {array}
     * @param widgets.type {string} Type of the widget
     * @param widgets.options {object} Objects to pass to the widget
     * @param templates {ITemplates}
     */
    static launch(apiKey: string, widgets: any[], templates: ITemplates = new Templates()) {
        const factory = new WidgetFactory();
        widgets.forEach(function(widget, index) {
            factory.createWidget(widget, index, apiKey, templates);
        });
    }

}
