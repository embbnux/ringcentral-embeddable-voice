"use strict";(self.webpackChunkringcentral_embeddable=self.webpackChunkringcentral_embeddable||[]).push([[493],{318598:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){function isPlanEventEnabled(plan,planEvent){var _a,_b;return"boolean"==typeof(null==planEvent?void 0:planEvent.enabled)?planEvent.enabled:null===(_b=null===(_a=null==plan?void 0:plan.__default)||void 0===_a?void 0:_a.enabled)||void 0===_b||_b}__webpack_require__.d(__webpack_exports__,{n:function(){return isPlanEventEnabled}})},570527:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{schemaFilter:function(){return schemaFilter}});var tslib__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(207698),_lib_is_plan_event_enabled__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(318598);function schemaFilter(track,settings){function filter(ctx){var plan=track,ev=ctx.event.event;if(plan&&ev){var planEvent=plan[ev];if(!(0,_lib_is_plan_event_enabled__WEBPACK_IMPORTED_MODULE_0__.n)(plan,planEvent))return ctx.updateEvent("integrations",(0,tslib__WEBPACK_IMPORTED_MODULE_1__.pi)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.pi)({},ctx.event.integrations),{All:!1,"Segment.io":!0})),ctx;var disabledActions=function(plan,settings){var _a,_b;if(!plan||!Object.keys(plan))return{};var disabledIntegrations=plan.integrations?Object.keys(plan.integrations).filter((function(i){return!1===plan.integrations[i]})):[],disabledRemotePlugins=[];return(null!==(_a=settings.remotePlugins)&&void 0!==_a?_a:[]).forEach((function(p){disabledIntegrations.forEach((function(int){(p.name.includes(int)||int.includes(p.name))&&disabledRemotePlugins.push(p.name)}))})),(null!==(_b=settings.remotePlugins)&&void 0!==_b?_b:[]).reduce((function(acc,p){return p.settings.subscriptions&&disabledRemotePlugins.includes(p.name)&&p.settings.subscriptions.forEach((function(sub){return acc["".concat(p.name," ").concat(sub.partnerAction)]=!1})),acc}),{})}(planEvent,settings);ctx.updateEvent("integrations",(0,tslib__WEBPACK_IMPORTED_MODULE_1__.pi)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.pi)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.pi)({},ctx.event.integrations),null==planEvent?void 0:planEvent.integrations),disabledActions))}return ctx}return{name:"Schema Filter",version:"0.1.0",isLoaded:function(){return!0},load:function(){return Promise.resolve()},type:"before",page:filter,alias:filter,track:filter,identify:filter,group:filter}}}}]);