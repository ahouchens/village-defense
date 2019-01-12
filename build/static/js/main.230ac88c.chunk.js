(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,a){e.exports=a(24)},16:function(e,t,a){},18:function(e,t,a){},20:function(e,t,a){},22:function(e,t,a){},24:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(9),o=a.n(r),c=(a(16),a(2)),i=a(3),l=a(5),u=a(4),h=a(6),p=a(1),m=(a(18),a(7)),d=(a(20),function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).scrollToBottom=function(){a.messagesEnd.scrollIntoView({behavior:"smooth"})},a.handleKeyPress=a.handleKeyPress.bind(Object(p.a)(Object(p.a)(a))),a.handleChange=a.handleChange.bind(Object(p.a)(Object(p.a)(a))),a.state={chatMessage:"",disabled:"",chatName:!1,authorColor:!1,chatHistory:[]},a.input=s.a.createRef(),a}return Object(h.a)(t,e),Object(i.a)(t,[{key:"handleKeyPress",value:function(e){if("Enter"===e.key){var t=this.state.chatMessage;if(!t)return;this.props.connection.send(JSON.stringify({type:"chat-message",data:t})),this.setState({chatMessage:""}),!1===this.state.chatName&&this.setState({chatName:t})}}},{key:"handleChange",value:function(e){this.setState({chatMessage:e.target.value})}},{key:"componentDidUpdate",value:function(e){if(e.socketMessage!==this.props.socketMessage){var t=this.socketMessageObject();if(!t)return;"color"===t.type&&this.setState({chatName:t.userName,authorColor:t.data}),"history"===t.type&&this.setState({chatHistory:t.data}),"message"===t.type&&(this.setState(function(e){return{chatHistory:[].concat(Object(m.a)(e.chatHistory),[t.data])}}),this.scrollToBottom())}}},{key:"socketMessageObject",value:function(){try{return JSON.parse(this.props.socketMessage)}catch(e){return console.log("Invalid JSON: ",this.props.socketMessage),!1}}},{key:"isUserConnected",value:function(){return!!this.socketMessageObject()}},{key:"statusText",value:function(){return this.state.chatName.length>0?this.state.chatName:"Enter name:"}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"chat"},s.a.createElement("div",{className:"content"},this.state.chatHistory.map(function(e){return s.a.createElement("p",{className:"content-message",key:e.time},s.a.createElement("span",{style:{color:e.color,marginRight:"5px"}},e.author),e.text)}),s.a.createElement("div",{style:{float:"left",clear:"both"},ref:function(t){e.messagesEnd=t}})),s.a.createElement("div",null,s.a.createElement("div",{id:"status",className:"chat-status",style:{color:this.state.authorColor}},this.statusText()),s.a.createElement("input",{className:"chat-input",type:"text",id:"input",value:this.state.chatMessage,disabled:this.state.disabled,onKeyPress:this.handleKeyPress,onChange:this.handleChange})))}}]),t}(n.Component)),y=(a(22),function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).onKeyPress=a.onKeyPress.bind(Object(p.a)(Object(p.a)(a))),a.state={speed:5,id:a.props.id,topPosition:a.props.topPosition,leftPosition:a.props.leftPosition,color:a.props.color,userName:a.props.userName,currentPlayerCharacter:a.props.currentPlayerCharacter},a}return Object(h.a)(t,e),Object(i.a)(t,[{key:"componentWillReceiveProps",value:function(e){this.props!==e&&this.setState({id:e.id,topPosition:e.topPosition,leftPosition:e.leftPosition,color:e.color,currentPlayerCharacter:e.currentPlayerCharacter})}},{key:"isCurrentPlayerCharacter",value:function(){return this.state.currentPlayerCharacter.id===this.props.id}},{key:"onKeyPress",value:function(e){var t=this.state.topPosition,a=this.state.leftPosition,n=this.state.id,s=this.state.userName,r=this.state.color;"w"===e.key&&this.isCurrentPlayerCharacter()&&(t=this.state.topPosition-this.state.speed),"s"===e.key&&this.isCurrentPlayerCharacter()&&(t=this.state.topPosition+this.state.speed),"a"===e.key&&this.isCurrentPlayerCharacter()&&(a=this.state.leftPosition-this.state.speed),"d"===e.key&&this.isCurrentPlayerCharacter()&&(a=this.state.leftPosition+this.state.speed),this.setState({color:r,topPosition:t,leftPosition:a,userName:s,id:n,type:"update-character"}),this.props.connection.send(JSON.stringify({type:"update-character",id:this.state.id,userName:this.state.userName,color:this.state.color,leftPosition:a,topPosition:t}))}},{key:"render",value:function(){return s.a.createElement("div",{className:"player-character",key:this.state.id,onKeyDown:this.onKeyPress,tabIndex:"0",style:{backgroundColor:this.state.color,top:this.state.topPosition+"px",left:this.state.leftPosition+"px",WebkitTransition:"all 0.7s ease-out"}})}}]),t}(n.Component)),f=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={},a}return Object(h.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"grid-tile"})}}]),t}(n.Component),E=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).handleChange=a.handleChange.bind(Object(p.a)(Object(p.a)(a))),a.state={playerCharacters:[],currentPlayerCharacter:{}},a.input=s.a.createRef(),a}return Object(h.a)(t,e),Object(i.a)(t,[{key:"handleChange",value:function(e){this.setState({chatMessage:e.target.value})}},{key:"componentDidUpdate",value:function(e){if(e.socketMessage!==this.props.socketMessage){var t=this.socketMessageObject();if(!t)return;if("current-player-character"===t.type&&(console.log("current player character!"),this.setState(function(e){return{currentPlayerCharacter:t}})),"invoke-character"===t.type&&this.setState(function(e){return{playerCharacters:[].concat(Object(m.a)(e.playerCharacters),[t])}}),"update-character"===t.type){var a=this.state.playerCharacters.findIndex(function(e){return e.id===t.id}),n=Object(m.a)(this.state.playerCharacters);n[a]=Object.assign(this.state.playerCharacters[a],{id:t.id,topPosition:t.topPosition,leftPosition:t.leftPosition,color:t.color}),Object.assign(n[a],{id:t.id,topPosition:t.topPosition,leftPosition:t.leftPosition,color:t.color}),this.setState({playerCharacters:n})}if("remove-character"===t.type){var s=this.state.playerCharacters.findIndex(function(e){return e.id===t.id}),r=Object(m.a)(this.state.playerCharacters);r.splice(s,1),this.setState({playerCharacters:r})}}}},{key:"socketMessageObject",value:function(){try{return JSON.parse(this.props.socketMessage)}catch(e){return console.log("Invalid JSON: ",this.props.socketMessage),!1}}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"grid"},this.state.playerCharacters.map(function(t){return s.a.createElement(y,{id:t.id,key:t.id,topPosition:t.topPosition,leftPosition:t.leftPosition,color:t.color,userName:t.userName,connection:e.props.connection,currentPlayerCharacter:e.state.currentPlayerCharacter})}),s.a.createElement("div",{className:"grid-tile-row"},s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null)),s.a.createElement("div",{className:"grid-tile-row"},s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null)),s.a.createElement("div",{className:"grid-tile-row"},s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null)),s.a.createElement("div",{className:"grid-tile-row"},s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null),s.a.createElement(f,null)))}}]),t}(n.Component),g=function(e){function t(e){var a;Object(c.a)(this,t),a=Object(l.a)(this,Object(u.a)(t).call(this,e));var n=("https:"===window.location.protocol?"wss://":"ws://")+window.location.host;return a.connection=new WebSocket(n),a.connection.onopen=a.onOpen,a.connection.onerror=a.onError,a.connection.onmessage=a.onMessage.bind(Object(p.a)(Object(p.a)(a))),a.state={socketMessage:{data:""}},a}return Object(h.a)(t,e),Object(i.a)(t,[{key:"onOpen",value:function(){console.log("Connection is opened...")}},{key:"onError",value:function(e){console.log("Connection error occured!",e)}},{key:"onMessage",value:function(e){this.setState({socketMessage:e})}},{key:"render",value:function(){return s.a.createElement("div",{className:"app-container"},s.a.createElement(E,{connection:this.connection,socketMessage:this.state.socketMessage.data}),s.a.createElement(d,{connection:this.connection,socketMessage:this.state.socketMessage.data}))}}]),t}(n.Component),b=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={counter:0},a}return Object(h.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return s.a.createElement("div",null,s.a.createElement("h1",null," Village Defense "),s.a.createElement(g,{socketMessage:this.state.socketMessage}))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(s.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[10,2,1]]]);
//# sourceMappingURL=main.230ac88c.chunk.js.map