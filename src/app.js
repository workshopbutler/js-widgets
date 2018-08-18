import WidgetFactory from "./Factory";
import {getQueryParam} from "./common/helpers/_urlParser";

$(() => {
    window.WorkshopButlerWidgets = {
        launch: WidgetFactory.launch,
        getQueryParam: getQueryParam
    };
    document.dispatchEvent(new Event('wsbwidgetsloaded'));
});
