import WidgetFactory from "./widgets/Factory";
import {getQueryParam} from "./common/helpers/_urlParser";

$(() => {
    window.WorkshopButlerWidgets = {
        launch: WidgetFactory.launch,
        getDefaultTemplates: WidgetFactory.getDefaultTemplates,
        getQueryParam: getQueryParam
    };
    document.dispatchEvent(new Event('wsbwidgetsloaded'));
});
