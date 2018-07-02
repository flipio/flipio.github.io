webpackJsonp([1],{0:function(t,e){},"44Jl":function(t,e){},"90Bl":function(t,e){},Ko0s:function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={};n.d(r,"initGame",function(){return R}),n.d(r,"selectDot",function(){return I}),n.d(r,"deselectAll",function(){return N}),n.d(r,"removeDot",function(){return j}),n.d(r,"reviveDot",function(){return F});var a={};n.d(a,"grid",function(){return H}),n.d(a,"getAlive",function(){return M}),n.d(a,"getSelectedDot",function(){return $});var i=n("7+uW"),o=n("3EgV"),s=n.n(o),c=n("8+8L"),l=n("Dd8w"),d=n.n(l),u=n("NYxO"),f=n("M4fF"),v=n.n(f),m="https://dev.filipjelic.com",h=function(){return i.default.http.get(m+"/api/33traps/leaderboard")},p=function(t){return i.default.http.post(m+"/api/33traps/leaderboard",t)},g={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"loader",class:{darker:void 0!==this.dark}},[e("v-progress-circular",{attrs:{indeterminate:"",color:"amber"}})],1)},staticRenderFns:[]};var x=n("VU/8")({name:"loader",props:["dark"]},g,!1,function(t){n("sb75")},null,null).exports,_={name:"leaderboard",components:{Loader:x},methods:{getLeaderboard:function(){var t=this;this.loader=!0,h().then(function(e){var n=v.a.map(v.a.orderBy(e.body.data,["record"],["asc"]),function(t,e){return t.rank=e+1,t});t.items=n,setTimeout(function(){t.loader=!1},500)})}},mounted:function(){this.getLeaderboard()},data:function(){return{loader:!1,items:[],headers:[{text:"#",align:"left",sortable:!1,value:"rank"},{text:"Nickname",align:"center",sortable:!1,value:"nickname"},{text:"Score",align:"center",sortable:!1,value:"record"}]}}},b={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-flex",{staticClass:"leaderboard"},[t.loader?n("Loader",{attrs:{dark:""}}):t._e(),t._v(" "),n("ul",[n("v-data-table",{staticClass:"elevation-4",attrs:{headers:t.headers,items:t.items,"hide-actions":""},scopedSlots:t._u([{key:"items",fn:function(e){return[n("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.rank))]),t._v(" "),n("td",{staticClass:"text-xs-center"},[t._v(t._s(e.item.nickname))]),t._v(" "),n("td",{staticClass:"text-xs-center"},[t._v(t._s(e.item.record))])]}}])})],1)],1)},staticRenderFns:[]};var k={name:"game",components:{Leaderboard:n("VU/8")(_,b,!1,function(t){n("Ko0s")},"data-v-a69cdc0e",null).exports,Loader:x},methods:d()({refreshData:function(){this.$refs.leaderboardInstance.getLeaderboard()},submitScore:function(){var t=this,e=this.getAlive(),n=this.nickname;if(n.length>20)return this.error="Nickname to long. Please create nickname with less then 20 characters",void setTimeout(function(){t.error=null},5e3);n.length>0&&(this.loader=!0,p({nickname:this.nickname,record:e}).then(function(){setTimeout(function(){t.loader=!1},500)}))},restartGame:function(){this.initGame()},dotClick:function(t){if(t){var e,n,r,a,i,o,s,c,l=this.getSelectedDot();if(l){var d=null;if(!0!==t.exists&&(i=t,o=null,s=null,c=null,(a=l).x===i.x?(a.y>i.y?(s=i,c=a):(s=a,c=i),c.y-s.y==2&&((o={}).y=s.y+1,o.x=s.x)):a.y===i.y&&(a.x>i.x?(s=i,c=a):(s=a,c=i),c.x-s.x==2&&((o={}).y=s.y,o.x=s.x+1)),d=o),d){var u=(e=this.gameGrid,n=d.x,r=d.y,v.a.find(e[n],function(t){return t&&t.y===r}));!0===u.exists&&(this.removeDot(l),this.removeDot(u),this.reviveDot(t),this.deselectAll())}}t.exists&&(this.deselectAll(t),this.selectDot(t))}}},Object(u.b)(["deselectAll","selectDot","removeDot","reviveDot","initGame"]),Object(u.c)(["grid","getSelectedDot","getAlive"])),computed:{gameGrid:function(){return this.grid()}},data:function(){return{loader:!1,nickname:"",error:null}}},y={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-flex",{staticClass:"game game-width"},[t.loader?n("Loader"):t._e(),t._v(" "),n("div",{staticClass:"text-xs-center game-width"},[n("v-btn",{attrs:{round:"",color:"primary",dark:"",ripple:""},on:{click:t.restartGame}},[t._v("Restart Game")]),t._v(" "),n("v-dialog",{attrs:{scrollable:"","max-width":"400px"}},[n("v-btn",{attrs:{slot:"activator",color:"primary",dark:"",ripple:"",round:""},on:{click:t.refreshData},slot:"activator"},[t._v("Leaderboard")]),t._v(" "),n("Leaderboard",{ref:"leaderboardInstance"})],1),t._v(" "),n("v-dialog",{attrs:{scrollable:"","max-width":"400px"}},[n("v-btn",{attrs:{slot:"activator",color:"primary",dark:"",ripple:"",round:""},slot:"activator"},[t._v("\n        How to?\n      ")]),t._v(" "),n("v-flex",{staticClass:"how-to"},[n("p",[t._v('\n          Click on a black dot ( it becomes automatically selected ) and move it to an empty (white) slot. By doing so you are "eating" the dot that is being jumped over. Continue in that fashion until you have reached the goal.\n          The goal is to have only one black dot left. You can only "jump" over 1 dot at a time.\n        ')]),t._v(" "),n("img",{staticClass:"how-to-gif",attrs:{src:"static/how-to.gif",alt:"How to?"}})])],1)],1),t._v(" "),n("div",{staticClass:"grid game-width"},t._l(t.gameGrid,function(e){return n("div",{staticClass:"grid-row"},t._l(e,function(e){return n("div",{staticClass:"grid-el",on:{click:function(n){t.dotClick(e)}}},[e?n("span",{staticClass:"grid-el-fill",class:{filled:e.exists,invalid:!e.exists,selected:e.selected}}):t._e(),t._v(" "),e?t._e():n("span",{staticClass:"grid-el-fill not-available"})])}))})),t._v(" "),n("v-divider"),t._v(" "),n("v-container",{staticClass:"result-submit",attrs:{"grid-list-md":"","text-xs-center":""}},[n("v-layout",{attrs:{row:"",wrap:""}},[n("v-flex",{attrs:{xs6:""}},[n("v-text-field",{attrs:{name:"nickname-input",label:"Enter nickname"},model:{value:t.nickname,callback:function(e){t.nickname=e},expression:"nickname"}})],1),t._v(" "),n("v-flex",{staticClass:"self-center",attrs:{xs6:"","text-xs-center":""}},[n("v-btn",{attrs:{color:"primary",dark:"",ripple:"",round:""},on:{click:t.submitScore}},[t._v("Submit score")])],1)],1),t._v(" "),t.error?n("v-flex",{attrs:{xs12:""}},[n("span",{staticClass:"red darken-1"},[t._v(t._s(t.error))])]):t._e()],1)],1)},staticRenderFns:[]};var E={methods:{},components:{Game:n("VU/8")(k,y,!1,function(t){n("44Jl")},"data-v-02f72616",null).exports},data:function(){return{}}},D={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"home"},[e("h1",[this._v("33 Traps")]),this._v(" "),e("game")],1)},staticRenderFns:[]};var C={name:"app",components:{Home:n("VU/8")(E,D,!1,function(t){n("i8xs")},"data-v-be53bdc2",null).exports}},T={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("v-app",[e("v-toolbar",{attrs:{app:""}},[e("h3",[this._v("33 Traps")])]),this._v(" "),e("v-content",[e("v-container",{attrs:{fluid:""}},[e("Home")],1)],1),this._v(" "),e("v-footer",{attrs:{app:""}})],1)],1)},staticRenderFns:[]};var L,w=n("VU/8")(C,T,!1,function(t){n("90Bl")},null,null).exports,O=n("bOdI"),S=n.n(O),A=[[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[1,1,1,1,1,1,1],[1,1,1,2,1,1,1],[1,1,1,1,1,1,1],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0]],G=function(){var t={},e={exists:!1,selected:!1,x:"",y:""};return v.a.forEach(A,function(n,r){var a=[];v.a.forEach(n,function(t,n){var i=v.a.cloneDeep(e);1===t&&(i.exists=!0),i.x=r,i.y=n,0===t&&(i=null),a.push(i)}),t[r]=a}),t},V={state:{title:"33 Traps",grid:G()},mutations:(L={},S()(L,"INIT_GAME",function(t){t.grid=G()}),S()(L,"SELECT_DOT",function(t,e){var n=e.x,r=e.y,a=v.a.cloneDeep(t.grid[n]);v.a.find(a,function(t){return t&&t.x===n&&t.y===r}).selected=!0,t.grid[n]=a}),S()(L,"DESELECT_ALL",function(t){v.a.forEach(t.grid,function(e,n){var r=v.a.cloneDeep(e),a=!1;v.a.forEach(r,function(t){t&&!0===t.selected&&(t.selected=!1,a=!0)}),a&&(t.grid[n]=r)})}),S()(L,"SELECT_DOT",function(t,e){var n=e.x,r=e.y,a=v.a.cloneDeep(t.grid[n]);v.a.find(a,function(t){return t&&t.x===n&&t.y===r}).selected=!0,t.grid[n]=a}),S()(L,"REMOVE_DOT",function(t,e){var n=e.x,r=e.y,a=v.a.cloneDeep(t.grid[n]),i=v.a.find(a,function(t){return t&&t.x===n&&t.y===r});i.selected=!1,i.exists=!1,t.grid[n]=a}),S()(L,"REVIVE_DOT",function(t,e){var n=e.x,r=e.y,a=v.a.cloneDeep(t.grid[n]),i=v.a.find(a,function(t){return t&&t.x===n&&t.y===r});i.selected=!1,i.exists=!0,t.grid[n]=a}),L)},R=function(t){(0,t.commit)("INIT_GAME")},I=function(t,e){(0,t.commit)("SELECT_DOT",e)},N=function(t){(0,t.commit)("DESELECT_ALL")},j=function(t,e){(0,t.commit)("REMOVE_DOT",e)},F=function(t,e){(0,t.commit)("REVIVE_DOT",e)},H=function(t){return t.game.grid},M=function(t){var e=t.game,n=0;return v.a.forEach(e.grid,function(t){v.a.forEach(t,function(t){t&&t.exists&&n++})}),n},$=function(t){var e=t.game.grid,n=null;return v.a.forEach(e,function(t){v.a.forEach(t,function(t){if(t&&t.selected)return n=t,!0})}),n},U=n("sax8"),B=n.n(U);i.default.use(u.a);i.default.config.debug=!0;var J=new u.a.Store({modules:{game:V},actions:r,getters:a,strict:!0,plugins:[B()()]});i.default.use(c.a),i.default.http.interceptors.push(function(t,e){t.credentials=!1,e()}),i.default.use(s.a),i.default.config.productionTip=!1,new i.default({el:"#app",store:J,template:"<App/>",components:{App:w}})},i8xs:function(t,e){},sb75:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.fd33ad78861e6f347fb1.js.map