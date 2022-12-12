import { Module } from '../module.mjs';


class HtmlModule extends Module {
    constructor(interp) {
        super("html", interp, FORTHIC);
        this.add_module_word("ELEMENT", this.word_ELEMENT);
        this.add_module_word("NS-ELEMENT", this.word_NS_ELEMENT);
        this.add_module_word("<APPEND", this.word_l_APPEND);
        this.add_module_word("CHILD-NODES", this.word_CHILD_NODES);
        this.add_module_word("<INNER-HTML!", this.word_l_INNER_HTML_bang);
        this.add_module_word("INNER-HTML", this.word_INNER_HTML);
        this.add_module_word("<INNER-TEXT!", this.word_l_INNER_TEXT_bang);
        this.add_module_word("INNER-TEXT", this.word_INNER_TEXT);
        this.add_module_word("<INSERT-ADJ-HTML", this.word_l_INSERT_ADJ_HTML);

        this.add_module_word("<ATTR!", this.word_l_ATTR_bang);
        this.add_module_word("ATTR", this.word_ATTR);

        this.add_module_word("<ADD-CLASS", this.word_l_ADD_CLASS);
        this.add_module_word("<REMOVE-CLASS", this.word_l_REMOVE_CLASS);
        this.add_module_word("CLASSES", this.word_CLASSES);

        this.add_module_word("<HIDE", this.word_l_HIDE);
        this.add_module_word("<SHOW", this.word_l_SHOW);
        this.add_module_word("SHOW-IF", this.word_SHOW_IF);
        this.add_module_word("<DISABLE", this.word_l_DISABLE);
        this.add_module_word("<ENABLE", this.word_l_ENABLE);
        this.add_module_word("ENABLE-IF", this.word_ENABLE_IF);
        this.add_module_word("<VALUE!", this.word_l_VALUE_bang);
        this.add_module_word("VALUE!", this.word_VALUE_bang);
        this.add_module_word("VALUE", this.word_VALUE);
        this.add_module_word("CHECKED", this.word_CHECKED);
        this.add_module_word("CHECKED!", this.word_CHECKED_bang);

        this.add_module_word("ID>ELEMENT", this.word_ID_to_ELEMENT);
        this.add_module_word("CLASS>ELEMENTS", this.word_CLASS_to_ELEMENTS);

        // Javascript-only
        this.add_module_word("BODY", this.word_BODY);
        this.add_module_word("TEXT-NODE", this.word_TEXT_NODE);
        this.add_module_word("EVENT", this.word_EVENT);
        this.add_module_word("DISPATCH", this.word_DISPATCH);

        this.add_module_word("CSS", this.word_CSS);
        this.add_module_word("CANVAS-CONTEXT", this.word_CANVAS_CONTEXT);
        this.add_module_word("TITLE!", this.word_TITLE_bang);
        this.add_module_word("<ADD-LISTENER", this.word_l_ADD_LISTENER);
        this.add_module_word("<REMOVE-LISTENER", this.word_l_REMOVE_LISTENER);
        this.add_module_word("WINDOW", this.word_WINDOW);
        this.add_module_word("RELOAD", this.word_RELOAD);
        this.add_module_word("SET-TIMEOUT", this.word_SET_TIMEOUT);
        this.add_module_word("RUN-ON-SERVER", this.word_RUN_ON_SERVER);
        this.add_module_word("SERVER-PROMISE", this.word_SERVER_PROMISE);
        this.add_module_word("START-JOB-PROMISE", this.word_START_JOB_PROMISE);
        this.add_module_word("SERVER-FORTHIC-BUTTON", this.word_SERVER_FORTHIC_BUTTON);
        this.add_module_word("NEXT-EVENT-LOOP", this.word_NEXT_EVENT_LOOP);
        this.add_module_word("AWAIT", this.word_AWAIT);
        this.add_module_word("<THEN", this.word_l_THEN);
        this.add_module_word("<CATCH", this.word_l_CATCH);
        this.add_module_word("ALERT", this.word_ALERT);
    }

    // ( type -- element )
    word_ELEMENT(interp) {
        let element_type = interp.stack_pop()
        let result = document.createElement(element_type);
        interp.stack_push(result);
    }

    // ( type namespace -- element )
    word_NS_ELEMENT(interp) {
        let namespace = interp.stack_pop()
        let element_type = interp.stack_pop()

        let result = document.createElementNS(namespace, element_type);
        interp.stack_push(result);
    }

    // ( parent child -- parent )
    // ( parent child_items -- parent )
    word_l_APPEND(interp) {
        let child = interp.stack_pop();
        let parent = interp.stack_pop();

        function add_child(child) {
            if (child instanceof Array){
                child.forEach(item => add_child(item));
            }
            else {
                parent.appendChild(child);
            }
        }

        if (parent)   add_child(child);
        interp.stack_push(parent);
    }

    // ( parent -- child_items )
    word_CHILD_NODES(interp) {
        let parent = interp.stack_pop();
        let result = [];
        if (parent)   result = parent.childNodes;
        interp.stack_push(result);
    }

    // ( element text -- element )
    word_l_INNER_HTML_bang(interp) {
        let text = interp.stack_pop();
        let element = interp.stack_pop();

        // TODO: Sanitize text
        if (element)   element.innerHTML = text;
        interp.stack_push(element);
    }

    // ( element -- text )
    word_INNER_HTML(interp) {
        let element = interp.stack_pop();
        let result = null;
        if (element)   result = element.innerHTML;
        interp.stack_push(result);
    }

    // ( element text -- element )
    word_l_INNER_TEXT_bang(interp) {
        let text = interp.stack_pop();
        let element = interp.stack_pop();

        if (element)   element.innerText = text;
        interp.stack_push(element);
    }

    // ( element -- text )
    word_INNER_TEXT(interp) {
        let element = interp.stack_pop();
        let result = null;
        if (element)   result = element.innerText;
        interp.stack_push(result);
    }

    // ( element text pos_str -- element )
    // pos_str is one of: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
    word_l_INSERT_ADJ_HTML(interp) {
        let pos_str = interp.stack_pop();
        let text = interp.stack_pop();
        let element = interp.stack_pop();

        let valid_pos_strs = ['beforebegin', 'afterbegin', 'beforeend', 'afterend'];
        if (valid_pos_strs.indexOf(pos_str) < 0) {
            throw `'${pos_str}' not one of the valid pos_strs: ${valid_pos_strs}`;
        }
        if (element)   element.insertAdjacentHTML(pos_str, text);
        interp.stack_push(element);
    }

    // ( canvas 2d_or_3d -- context )
    word_CANVAS_CONTEXT(interp) {
        let kind = interp.stack_pop()
        let canvas = interp.stack_pop();
        let result = null;
        if (canvas)   result = canvas.getContext(kind);
        interp.stack_push(result);
    }

    // ( -- body )
    word_BODY(interp) {
        interp.stack_push(document.body);
    }

    // ( str -- TextNode )
    word_TEXT_NODE(interp) {
        let str = interp.stack_pop();
        let result = document.createTextNode(str);
        interp.stack_push(result);
    }

    // ( label -- Event )
    word_EVENT(interp) {
        let label = interp.stack_pop();
        let result = new Event(label);
        interp.stack_push(result);
    }

    // ( element Event -- )
    word_DISPATCH(interp) {
        let event = interp.stack_pop();
        let elem = interp.stack_pop();
        elem.dispatchEvent(event);
    }

    // ( css_filename -- )
    word_CSS(interp) {
        let css_filename = interp.stack_pop();
        let head  = document.getElementsByTagName('head')[0];
        let fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", css_filename);
        head.appendChild(fileref)
    }

    // ( element key val -- element )
    // ( element pairs -- element )
    word_l_ATTR_bang(interp) {
        let val = interp.stack_pop();
        let pairs;
        if (val instanceof Array) {
            pairs = val
        }
        else {
            let key = interp.stack_pop();
            pairs = [[key, val]];
        }
        let element = interp.stack_pop();

        if (element) {
            pairs.forEach(pair => {
                element.setAttribute(pair[0], pair[1]);
            });
        }
        interp.stack_push(element);
    }

    // ( element key -- val )
    word_ATTR(interp) {
        let key = interp.stack_pop();
        let element = interp.stack_pop();
        let result = null;
        if (element)   result = element.getAttribute(key);
        interp.stack_push(result);
    }

    // ( element class -- element )
    // ( element classes -- element )
    word_l_ADD_CLASS(interp) {
        let css_class = interp.stack_pop();
        let element = interp.stack_pop();
        if (element)   add_css_class(element, css_class);
        interp.stack_push(element);
    }

    // ( element -- classes )
    word_CLASSES(interp) {
        let element = interp.stack_pop();
        let result = [];
        if (element)   result = element.className.split(" ");
        interp.stack_push(result);
    }

    // ( element class -- element )
    // ( element classes -- element )
    word_l_REMOVE_CLASS(interp) {
        let css_class = interp.stack_pop();
        let element = interp.stack_pop();
        if (element)   remove_css_class(element, css_class);
        interp.stack_push(element);
    }

    // ( -- window )
    word_WINDOW(interp) {
        interp.stack_push(window);
    }

    // ( -- )
    word_RELOAD(interp) {
        location.reload();
    }

    // ( forthic timeout -- )
    word_SET_TIMEOUT(interp) {
        let timeout = interp.stack_pop();
        let forthic = interp.stack_pop();

        setTimeout(function() {
            interp.run(forthic);
        }, timeout);
    }

    // ( element -- element )
    word_l_HIDE(interp) {
        let element = interp.stack_pop();
        if (element)   element.style.display = "none";
        interp.stack_push(element);
    }

    // ( element -- element )
    word_l_SHOW(interp) {
        let element = interp.stack_pop();
        if (element)   element.style.display = "block";
        interp.stack_push(element);
    }

    // ( element bool -- )
    word_SHOW_IF(interp) {
        let should_show = interp.stack_pop();
        let element = interp.stack_pop();

        if (!element)   return;

        if (should_show) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    }

    // ( forthic done_forthic fail_forthic -- )
    word_RUN_ON_SERVER(interp) {
        let fail_forthic = interp.stack_pop();
        let done_forthic = interp.stack_pop();
        let forthic = interp.stack_pop();

        function get_forthic_route() {
            var base = window.location.origin + window.location.pathname;
            var end = base[base.length-1] == "/" ? "forthic" : "/forthic";
            return base + end;
        }
        $.ajax({
            type: "POST",
            url: get_forthic_route(),
            data: {
                'forthic': forthic
            }
        }).done( function(data) {
            if (data.result !== null) {
                interp.stack_push(data.result);
            }
            interp.run(done_forthic);
        }).fail( function(xhr, status, error) {
            console.error(xhr.responseText);
            let error_text = JSON.parse(xhr.responseText).split("\n")[0];
            alert("Problem executing action. " + error_text);
            interp.stack_push(xhr);
            interp.run(fail_forthic);
        });
    }

    // ( forthic -- Promise )
    word_SERVER_PROMISE(interp) {
        let forthic = interp.stack_pop();

        function get_forthic_route() {
            var base = window.location.origin + window.location.pathname;
            var end = base[base.length-1] == "/" ? "forthic" : "/forthic";
            return base + end;
        }

        function run_forthic_promise(forthic) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: get_forthic_route(),
                    data: {
                        'forthic': forthic
                    }
                }).done( function(data) {
                    if (data.result !== null) {
                        resolve(data.result);
                    }
                    resolve();
                }).fail( function(xhr, status, error) {
                    console.error(xhr.responseText);
                    let error_text = JSON.parse(xhr.responseText).split("\n")[0];
                    reject(error_text);
                });
            });
        }

        let result = run_forthic_promise(forthic);
        interp.stack_push(result);
    }

    // ( forthic -- )
    word_START_JOB_PROMISE(interp) {
        let forthic = interp.stack_pop();

        function get_start_job_route() {
            var base = window.location.origin + window.location.pathname;
            var end = base[base.length-1] == "/" ? "start_job" : "/start_job";
            return base + end;
        }

        function run_forthic_promise(forthic) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: get_start_job_route(),
                    data: {
                        'forthic': forthic
                    }
                }).done( function(data) {
                    if (data.result !== null) {
                        resolve(data.result);
                    }
                    resolve();
                }).fail( function(xhr, status, error) {
                    console.error(xhr.responseText);
                    let error_text = JSON.parse(xhr.responseText).split("\n")[0];
                    reject(error_text);
                });
            });
        }

        let result = run_forthic_promise(forthic);
        interp.stack_push(result);
    }

    // ( button_id args_forthic server_forthic -- ServerForthicButton )
    // NOTE: `args_forthic` must evaluate to an array of arguments.
    //       Each arg will be "escaped" using JSON, so the `server_forthic` must call `JSON>` on
    //       each arg to unescape it.
    word_SERVER_FORTHIC_BUTTON(interp) {
        let server_forthic = interp.stack_pop();
        let args_forthic = interp.stack_pop();
        let button_id = interp.stack_pop();
        let result = new ServerForthicButton(interp, button_id, args_forthic, server_forthic);
        interp.stack_push(result);
    }

    // ( --  )
    async word_NEXT_EVENT_LOOP(interp) {
        // This is meant to be used with AWAIT so the next word runs in the next event loop
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        interp.stack_push(wait(50));
    }

    // ( Promise -- ? )
    async word_AWAIT(interp) {
        let promise = interp.stack_pop();
        let result = await promise;
        interp.stack_push(result);
    }

    // ( Promise forthic -- Promise )
    async word_l_THEN(interp) {
        let forthic = interp.stack_pop(forthic);
        let promise = interp.stack_pop();

        async function then_func(res) {
            interp.stack_push(res);
            await interp.run(forthic);
            let next_res = interp.stack_pop();
            return next_res;
        }

        let result = promise.then(then_func)
        interp.stack_push(result);
    }

    // ( Promise forthic -- Promise )
    async word_l_CATCH(interp) {
        let forthic = interp.stack_pop()
        let promise = interp.stack_pop();

        async function catch_func(error) {
            interp.stack_push(error);
            await interp.run(forthic)
        }

        let result = promise.catch(catch_func)
        interp.stack_push(result);
    }

    // ( message -- )
    word_ALERT(interp) {
        let message = interp.stack_pop();
        alert(message);
    }

    // ( element -- element )
    word_l_DISABLE(interp) {
        let element = interp.stack_pop();
        if (element)   element.disabled = true;
        interp.stack_push(element);
    }

    // ( element -- element )
    word_l_ENABLE(interp) {
        let element = interp.stack_pop();
        if (element)   element.disabled = false;
        interp.stack_push(element);
    }

    // ( element bool -- )
    word_ENABLE_IF(interp) {
        let should_enable = interp.stack_pop();
        let element = interp.stack_pop();

        if (!element)   return;

        if (should_enable) {
            element.disabled = false;
        }
        else {
            element.disabled = true;
        }
    }

    // ( element value -- element )
    word_l_VALUE_bang(interp) {
        let value = interp.stack_pop();
        let element = interp.stack_pop();
        if (element)   element.value = value;
        interp.stack_push(element);
    }

    // ( element value -- )
    word_VALUE_bang(interp) {
        let value = interp.stack_pop();
        let element = interp.stack_pop();
        if (element)   element.value = value;
    }

    // ( element -- value )
    word_VALUE(interp) {
        let element = interp.stack_pop();
        let result = null;
        if (element)   result = element.value;
        interp.stack_push(result);
    }

    // ( element -- value )
    word_CHECKED(interp) {
        let element = interp.stack_pop();
        let result = null;
        if (element)   result = element.checked;
        interp.stack_push(result);
    }

    // ( element bool -- )
    word_CHECKED_bang(interp) {
        let checked = interp.stack_pop()
        let element = interp.stack_pop();
        if (element)   element.checked = checked;
    }

    // ( id -- element )
    async word_ID_to_ELEMENT(interp) {
        let id_str = interp.stack_pop();
        let result = await document.getElementById(id_str);
        if (!result) {
            console.warn(`Couldn't find element with ID '${id_str}'`);
        }
        interp.stack_push(result);
    }

    // ( class -- element )
    word_CLASS_to_ELEMENTS(interp) {
        let class_str = interp.stack_pop();
        let result = document.getElementsByClassName(class_str);
        interp.stack_push(result);
    }

    // ( str -- )
    word_TITLE_bang(interp) {
        let str = interp.stack_pop();
        document.title = str;
    }

    // ( elem event_type forthic -- elem )
    word_l_ADD_LISTENER(interp) {
        let forthic = interp.stack_pop();
        let event_type = interp.stack_pop();
        let elem = interp.stack_pop();

        async function handler(event) {
            interp.stack_push(event);
            await interp.run(forthic);
        }

        if (elem) {
            let handler_name = `forthic_${event_type}`;
            elem[handler_name] = handler;
            elem.addEventListener(event_type, handler);
        }
        interp.stack_push(elem);
    }

    // ( elem event_type -- elem )
    word_l_REMOVE_LISTENER(interp) {
        let event_type = interp.stack_pop();
        let elem = interp.stack_pop();

        if (elem) {
            let handler_name = `forthic_${event_type}`;
            let handler = elem[handler_name];
            elem.removeEventListener(event_type, handler);
            delete elem[handler_name];
        }
        interp.stack_push(elem);
    }

}

const FORTHIC = `
: COMMON-TYPES   ["H1" "H2" "H3" "H4" "H5" "H6"
                  "P" "UL" "OL" "LI"
                  "A" "SPAN" "I"
                  "TABLE" "TR" "TH" "TD"
                  "DIV" "SECTION" "PRE"
                  "STYLE" "IMG" "CANVAS"
                  "BUTTON" "TEXTAREA"
                  "SCRIPT"
                 ] ;

[ "type" ] VARIABLES
: FDEFINE-ELEMENT (type !) [": " type @  " '" type @ "' ELEMENT ;"] CONCAT ;
COMMON-TYPES "FDEFINE-ELEMENT INTERPRET" FOREACH

 : SVG-NS        "http://www.w3.org/2000/svg" ;
 : SVG-ELEMENT   SVG-NS NS-ELEMENT ;   # ( type -- element )
 : SVG           "svg" SVG-ELEMENT;

"BUSY-OVERLAY"   '''DIV "id" "busy-overlay" <ATTR!  "hidden" <ADD-CLASS
                  [ DIV "background" <ADD-CLASS
                    H1 '<i class="hourglass fas fa-hourglass-half"></i> Working...' <INNER-HTML!
                  ] <APPEND'''   MEMO

: BUSY       BUSY-OVERLAY "hidden" <REMOVE-CLASS POP ;
: NOT-BUSY   BUSY-OVERLAY "hidden" <ADD-CLASS POP ;
: INNER-HTML!   <INNER-HTML! POP;
: INNER-TEXT!   <INNER-TEXT! POP;
: APPEND        <APPEND POP;

: ENABLE   <ENABLE POP;
: DISABLE  <DISABLE POP;
: ADD-LISTENER   <ADD-LISTENER POP;

["word" "args"] VARIABLES
# NOTE: This is the older version of server execution that requires doing a "JSON>" call for each argument
: S-INTERPRET      SERVER-PROMISE "ALERT" <CATCH AWAIT;  # ( forthic -- server_response )
: S-FORTHIC        (word ! args !) [args @ ">JSON QUOTED" MAP word @] FLATTEN CONCAT;
: S-RUN            S-FORTHIC S-INTERPRET;  # ( args word -- server_response )

# NOTE: This is the newer version of server execution. It automatically adds the "JSON>" calls so any
#       Forthic word on the server can be called naturally
: SERVER-INTERPRET   SERVER-PROMISE "ALERT" <CATCH AWAIT;  # ( forthic -- server_response )
: SERVER-RUN   (word ! args !) [args @  ">JSON QUOTED  ' JSON>' CONCAT" MAP  word @] FLATTEN " " JOIN  SERVER-INTERPRET;

: SCRIPT-JS   "script" ELEMENT "type" "module" <ATTR! SWAP TEXT-NODE <APPEND;   # (js -- script)
: RUN-JS      BODY SWAP SCRIPT-JS APPEND;   # (js -- )

COMMON-TYPES EXPORT

 ["SVG-NS" "SVG-ELEMENT" "SVG" "BUSY-OVERLAY" "BUSY" "NOT-BUSY"
  "ENABLE" "DISABLE" "ADD-LISTENER"
  "INNER-HTML!" "INNER-TEXT!" "APPEND"
  "S-INTERPRET" "S-FORTHIC" "S-RUN"
  "SERVER-INTERPRET" "SERVER-RUN"
  "RUN-JS" "SCRIPT-JS"
] EXPORT
`;


function add_css_class(element, css_class) {
    let classes;
    if (css_class instanceof Array)   classes = css_class;
    else                              classes = [css_class];

    let element_classes = element.className.trim().split(" ");
    for (let i=0; i < classes.length; i++) {
        let item = classes[i];
        if (element_classes.indexOf(item) < 0)   element_classes.push(item);
    }

    element.className = element_classes.join(" ");
}


function remove_css_class(element, css_class) {
    let classes;
    if (css_class instanceof Array)   classes = css_class;
    else                              classes = [css_class];

    let element_classes = element.className.trim().split(" ");
    let remaining_classes = [];
    for (let i=0; i < element_classes.length; i++) {
        let item = element_classes[i];
        if (classes.indexOf(item) < 0)   remaining_classes.push(item);
    }

    element.className = remaining_classes.join(" ");
}


// ----- ServerForthicButton ---------------------------------------------------------------------------------
class ServerForthicButton {
    constructor(interp, button_id, args_forthic, server_forthic) {
        let self = this;
        self.ASYNC_BUTTON_KEY = '_async_forthic_button_state';  // Key for button states in server Forthic cache
        self.interp = interp;
        self.button_id = button_id;
        self.args_forthic = args_forthic;
        self.server_forthic = server_forthic;

        // Options (these are settable using <REC!)
        self.reload_page = true;
        self.confirmable = false;

        // Add supporting nodes
        self.button = $(`#${button_id}`);
        self.button.after(`<div id='${button_id}-error' style='display: none;'>
            <h3>Error Running Job</h3>
            <p id="${button_id}-error-message" class="error"></p>
            </div>`);
        self.button.after(`<p id='${button_id}-running' style='display: none;'>Running...</p>`)

        self.error_div = $(`#${button_id}-error`)
        self.error_message = $(`#${button_id}-error-message`)
        self.running_p = $(`#${button_id}-running`)

        // Hook up click handler
        $(`#${self.button_id}`).click(() => {self.handle_click()})

        // Pull initial state data and render
        setTimeout(() => {self.set_initial_state()}, 0);
    }

    async set_initial_state() {
        let state_info = await this.get_state_info();
        this.update_state(state_info);

        if (state_info.state == 'RUNNING')   this.check_state_periodically();
    }

    update_state(state_info) {
        switch (state_info.state) {
            case 'RUNNING':
                this.show_running_state();
                break;

            case 'ERROR':
                this.show_error_state(state_info.message)
                break;

            default:
                this.show_normal_state();
                break;
        }
    }

    async check_state_periodically() {
        let self = this;
        let state_info = await self.get_state_info();
        self.update_state(state_info);
        if (state_info.state == "RUNNING") {
            setTimeout(() => {self.check_state_periodically()}, 10000);
        }
    }

    show_normal_state() {
        this.error_div.hide()
        this.running_p.hide()
        this.button.prop("disabled", false);
    }

    show_running_state() {
        this.error_div.hide()
        this.running_p.show()
        this.button.prop("disabled", true);
    }

    show_error_state(message) {
        this.running_p.hide()
        this.error_div.show()
        this.error_message.text(message);
        this.button.prop("disabled", false);
    }

    async handle_click() {
        let self = this;
        if (self.confirmable) {
            if (!confirm("Are you sure?"))   return;
        }

        await self.interp.run(self.args_forthic);
        self.interp.stack_push(self.server_forthic);
        await self.interp.run("S-FORTHIC");
        let forthic = self.interp.stack_pop()

        $(`#${self.button_id}`).prop("disabled", true);

        $.ajax({
            type: "POST",
            url: self.get_forthic_route(),
            data: {
                'forthic': `'${forthic}' '${self.button_id}' {html RUN-ASYNC-BUTTON}`
            }
        }).done(function(data) {
            $(`#${self.button_id}`).prop("disabled", false);
            if (self.reload_page)   window.location.reload();
        })
        .fail( function(xhr, status, error) {
            console.error(xhr.responseText);
            let error_text = JSON.parse(xhr.responseText).split("\\n")[0];
            alert("Problem executing action. " + error_text);
            $(`#${self.button_id}`).prop("disabled", false);
        });

        // Wait a few seconds and then start checking state
        self.show_running_state();
        setTimeout(() => {self.check_state_periodically()}, 3000);
    }

    get_forthic_route() {
        var base = window.location.origin + window.location.pathname;
        var end = base[base.length-1] == "/" ? "forthic" : "/forthic";
        return base + end;
    }

    async get_state_info() {
        let result;
        try {
            let forthic = `'${this.ASYNC_BUTTON_KEY}' cache.CACHE@ '${this.button_id}' REC@ '' DEFAULT`;
            console.log(forthic)
            let response = await $.ajax({
                type: "POST",
                url: this.get_forthic_route(),
                data: {
                    'forthic': forthic
                }
            });
            result = response.result;
            return result;
        } catch (error) {
            console.error(error);
            console.error(error.responseText);
            let error_text = JSON.parse(error.responseText).split("\\n")[0];
            alert("Problem checking state. " + error_text);
        }
    }
}


function new_module(interp) {
    return new HtmlModule(interp);
}

export { HtmlModule, new_module, add_css_class, remove_css_class };
