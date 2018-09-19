import {getQueryParam} from './common/helpers/_urlParser';
import WidgetFactory from './widgets/Factory';

$(() => {
  (window as any).WorkshopButlerWidgets = {
    getQueryParam,
    launch: WidgetFactory.launch,
  };
  document.dispatchEvent(new Event('wsbwidgetsloaded'));
});
