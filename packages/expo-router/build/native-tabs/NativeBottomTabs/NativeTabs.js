"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeTabs = void 0;
const NativeBottomTabsNavigator_1 = require("./NativeBottomTabsNavigator");
const NativeTabTrigger_1 = require("./NativeTabTrigger");
exports.NativeTabs = Object.assign((props) => {
    return <NativeBottomTabsNavigator_1.NativeTabsNavigatorWithContext {...props}/>;
}, { Trigger: NativeTabTrigger_1.NativeTabTrigger });
//# sourceMappingURL=NativeTabs.js.map