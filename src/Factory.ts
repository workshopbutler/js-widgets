import {logError} from './common/Error';
import Schedule from "./widgets/Schedule";
import EventPage from "./widgets/EventPage";
import TrainerProfile from "./widgets/TrainerProfile";
import RegistrationPage from "./widgets/RegistrationPage";
import TrainerList from "./widgets/TrainerList";
import SidebarEventList from "./widgets/SidebarEventList";
import {ITemplates} from "./interfaces/ITemplates";
import Localisation from "./utils/Localisation";
import FactoryConfig from "./FactoryConfig";
import DefaultTemplates from "./DefaultTemplates";
import EndorsementList from "./widgets/EndorsementList";

// Singleton
let factory: WidgetFactory;

/**
 * Creates Workshop Butler JS Widgets
 */
export default class WidgetFactory {
    protected readonly loc: Localisation;

    constructor(config: FactoryConfig) {
        this.loc = new Localisation(config.locale, config.language);
}

    /**
     * @param config {object}
     * @param config.type {string} Type of the widget
     * @param config.target {string} DOM element to assign the widget to
     * @param apiKey {string}
     * @param index {number} Index for logging
     * @param templates {ITemplates} DefaultTemplates for widgets
     * @private
     */
    createWidget(config: any, index: number, apiKey: string, templates: ITemplates) {
        const supportedWidgets = ['Schedule', 'EventPage', 'RegistrationPage', 'TrainerProfile',
            'TrainerList', 'SidebarEventList', 'EndorsementList'];
        if (!config.type || supportedWidgets.indexOf(config.type) < 0) {
            logError(`Unknown widget type at the index ${index}`);
            return false;
        }
        if (!config.target || typeof config.target !== 'string') {
            logError(`Incorrect [target] attribute for the widget ${config.type}`);
            return false;
        }
        switch(config.type) {
            case 'Schedule':
                if (config.table && templates instanceof DefaultTemplates) {
                    (<DefaultTemplates>templates).changeScheduleLayout(true);
                }
                Schedule.plugin(config.target, apiKey, templates, this.loc, config);
                return true;
            case 'EndorsementList':
                EndorsementList.plugin(config.target, apiKey, templates, this.loc, config);
                return true;
            case 'EventPage':
                EventPage.plugin(config.target, apiKey, templates, this.loc, config);
                return true;
            case 'RegistrationPage':
                RegistrationPage.plugin(config.target, apiKey, templates, this.loc, config);
                return true;
            case 'TrainerProfile':
                TrainerProfile.plugin(config.target, apiKey, templates, this.loc, config);
                return true;
            case 'TrainerList':
                TrainerList.plugin(config.target, apiKey, templates, this.loc, config);
                return true;
            case 'SidebarEventList':
                SidebarEventList.plugin(config.target, apiKey, templates, this.loc, config);
                return true;
            default:
                logError(`Unknown widget type at the index ${index}`);
                return false;
        }
    }

    /**
     * Create the set of Workshop Butler widgets
     * @param config {FactoryConfig}
     * @param widgets {array}
     * @param widgets.type {string} Type of the widget
     * @param widgets.config {object} Objects to pass to the widget
     * @param templates {ITemplates}
     */
    static launch(config: any, widgets: any[], templates: ITemplates = new DefaultTemplates()) {
        const factoryConfig = FactoryConfig.create(config);
        if (factoryConfig) {
            if (!factory) {
                factory = new WidgetFactory(factoryConfig);
            }
            widgets.forEach(function (widget, index) {
                factory.createWidget(widget, index, config.apiKey, templates);
            });
        }
    }


}
