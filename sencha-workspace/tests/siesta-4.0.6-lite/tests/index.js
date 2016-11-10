/*
    This is Siesta's own test suite. DO NOT COPY from it, instead take a look in the /examples folder
*/

var harness = new Siesta.Harness.Browser.ExtJS()

var extJSConfigs = {
    '4.2.2' : [
        '../../extjs-4.2.2/resources/css/ext-all.css',
        '../../extjs-4.2.2/ext-all-debug.js',
        {
            url        : '../siesta-all.js',
            instrument : true
        },
        'lib/Siesta/Test/AssertionsTranslator.js'
    ],

    '5.1.0' : [
        '../../extjs-5.1.0/packages/ext-theme-classic/build/resources/ext-theme-classic-all-debug.css',
        '../../extjs-5.1.0/build/ext-all-debug.js',
        {
            url        : '../siesta-all.js',
            instrument : true
        },
        'lib/Siesta/Test/AssertionsTranslator.js'
    ],

    '5.1.2' : [
        '../../extjs-5.1.2/packages/ext-theme-classic/build/resources/ext-theme-classic-all-debug.css',
        '../../extjs-5.1.2/build/ext-all-debug.js',
        {
            url        : '../siesta-all.js',
            instrument : true
        },
        'lib/Siesta/Test/AssertionsTranslator.js'
    ],

    '6.0.1' : [
        '../../extjs-6.0.1/build/classic/theme-triton/resources/theme-triton-all.css',
        '../../extjs-6.0.1/build/ext-all-debug.js',
        '../../extjs-6.0.1/build/classic/theme-triton/theme-triton.js',
        {
            url        : '../siesta-all.js',
            instrument : true
        },
        'lib/Siesta/Test/AssertionsTranslator.js'
    ]
}

harness.configure({
    title : 'Siesta test suite',

    autoCheckGlobals : true,
    expectedGlobals  : [
        'Joose',
        'Class',
        'Role',
        'Module',
        'Singleton',
        'Scope',
        'JooseX',
        'use',
        'Data',
        'Siesta',
        '$',
        'jQuery',
        /jQuery\d+/,
        'rootjQuery',
        'XRegExp',
        'SyntaxHighlighter',
        'Sch',
        'Harness',
        '__REFADR__',
        'CodeMirror',
        'DeepDiff',
        'Sizzle',
        'onDirectCaptureEvent', // Ext5 in IE9
        'InputBlocker', // Touch 2.3.0
        'devicePixelRatio' // Touch 2.3.0 in IE
    ],

    overrideSetTimeout     : false,
    activateDebuggerOnFail : false,
    // this should use 3 steps up and not 2, because its being used relative to the pageUrl
    // tests/siesta_ui/601_siesta_ui.html
    loaderPath             : { 'Ext.ux' : '../../../extjs-6.0.1/packages/ux/src' },

    testClass : Class({
        isa  : Siesta.Test.ExtJS,
        does : [
            Siesta.Test.Self,
            Siesta.Test.Self.ExtJS
        ]
    }),
    recorderConfig: {
        recordOffsets           : false,
        uniqueComponentProperty : 'action'
    },

    preload : extJSConfigs[ '6.0.1' ]
})

function getRecorderExtractorTests(suffix) {
    suffix = '?' + suffix;

    var tests = [
        'recorder/target_extractor/010_browser.t.js',
        'recorder/target_extractor/020_extjs.t.js',
        'recorder/target_extractor/001_sanity.t.js',
        'recorder/target_extractor/002_targeting.t.js',
        'recorder/target_extractor/003_extjs_components_1.t.js',
        {
            requires : [ 'Ext.ux.ajax.SimManager' ],
            url      : 'recorder/target_extractor/004_extjs_components_form_fields.t.js'
        },
        'recorder/target_extractor/005_extjs_components_grid.t.js',
        'recorder/target_extractor/006_plain_html.t.js',
        'recorder/target_extractor/007_multistop_drag.t.js',
        'recorder/target_extractor/008_page_refresh.t.js',
        'recorder/target_extractor/009_menus.t.js',
        'recorder/target_extractor/010_slider.t.js',
        'recorder/target_extractor/011_extjs3.t.js',
        'recorder/target_extractor/011_extjs_in_frame.t.js',
        'recorder/target_extractor/012_extjs_components_dataview.t.js',
        'recorder/target_extractor/013_modkeys.t.js',
        'recorder/target_extractor/014_extjs_components_tabpanel.t.js',
        'recorder/target_extractor/018_generic_targets.t.js',
        'recorder/target_extractor/019_month_picker.t.js',
        'recorder/016_recorded_eventmodel.t.js'
    ];

    Joose.A.each(tests, function (desc, i) {
        typeof desc === 'string' ? tests[i] += suffix : desc.url += suffix;
    });

    return tests;
}

harness.start(
    {
        group : 'Sanity',

        items : [
            'sanity/010_sanity.t.js',
            {
                url         : 'sanity/013_lint.t.js',
                alsoPreload : ["sanity/jshint.js"]
            },
            /webkit/i.test(navigator.userAgent) || $.browser.msie && Number($.browser.version) >= 10 ?
            {
                url         : 'sanity/020_cmd_app_touch.t.js',
                pageUrl     : 'cmd_app_touch/build/production/TestApp/'
            }
                :
                null,
            {
                url         : 'sanity/030_cmd_app_extjs.t.js',
                pageUrl     : 'cmd_app_extjs/build/production/TestApp/'
            }
        ]
    },
    {
        group : 'Test class',

        items : [
            '011_function.t.js',
            '020_test.t.js',
            '021_begin_async.t.js',
            '021_assertions_1.t.js',
            '023_test_todo.t.js',
            '030_test_more.t.js',
            '031_test_more_chain.t.js',
            '201_function.t.js',
            '080_exception_parsing.t.js',
            '300_iframe_events.t.js',
            '301_iframe_target.t.js',
            '304_native_dialogs.t.js',
            '800_async_start_test.t.js',
            '801_camelcased_startTest.t.js',
            '802_override_setTimeout_in_subtest.t.js'
        ]
    },
    {
        group       : '`overrideSetTimeout` with sandbox disabled',

        preload             : [],
        sandbox             : false,
        overrideSetTimeout  : true,

        items       : [
        // TODO uncomment in the "context" branch
//            'ost/test1.t.js',
//            'ost/test2.t.js'
        ]
    },
    {
        group   : 'Key events',
        runCore : 'sequential',
        items   : [
            'keyevents/040_keyevent_simulation.t.js',
            'keyevents/041_keyevent_simulation2.t.js',
            'keyevents/042_keyevent_simulation3.t.js',
            'keyevents/043_special_keys.t.js',
            'keyevents/044_text_selection.t.js',
            'keyevents/045_cancel_keypress.t.js',
            'keyevents/046_type_with_options.t.js',
            'keyevents/047_enter_in_form.t.js',
            'keyevents/048_input_maxlength.t.js',
            'keyevents/049_enter_on_anchor.t.js',
            {
                url     : 'keyevents/050_tab_key_focus.t.js',
                runCore : 'sequential'
            },
            {
                url     : 'keyevents/050_tab_key_focus2.t.js',
                runCore : 'sequential'
            },
            {
                url     : 'keyevents/050_tab_key_focus3.t.js',
                runCore : 'sequential'
            },
            {
                url     : 'keyevents/051_tabbing.t.js',
                runCore : 'sequential'
            },
            'keyevents/052_type_waitfortarget.t.js',
            'keyevents/053_type_clear_selection.t.js',
            'keyevents/054_type_with_regex_validation.t.js',
            'keyevents/055_select_all.t.js',
            {
                url                 : 'keyevents/056_backspace_navigation.t.js',
                separateContext     : true,
                pageUrl             : 'html-pages/basic1.html'
            },
            'keyevents/057_modifier_keys.t.js'
        ]
    },
    {
        group : 'Visual tests',

        items : [
            '050_mouse_click.t.js',
            '050_mouse_click2.t.js',
            '050_targeting_normalization.t.js',
            '050_mouse_click_jquery.t.js',
            '051_mouse_overout.t.js',
            '051_mouse_overout_with_span.t.js',
            '052_mouse_move.t.js',
            '053_mouse_click_options.t.js',
            '054_mouse_click_not_visible.t.js',
            '055_mouseover_mouseenter.t.js',
            '056_is_element_scrolled_out.t.js',
            '056_click_element_scrolled.t.js',
            '056_click_element_scrolled2.t.js',
            '056_drag_element_scrolled.t.js',
            '056_click_in_hidden_area.t.js',
            '057_click_blur.t.js',
            '058_isElementVisible.t.js',
            '059_scrollTargetIntoView.t.js',
            '060_element.t.js',
            '060_element2.t.js',
            '061_element_wait_for_selectors.t.js',
            '062_element_wait_for_event.t.js',

            {
                pageUrl : 'blank.html',
                preload     : extJSConfigs[ '4.2.2' ],

                url : '063_hashchange.t.js'
            },
            '064_element_scroll_to.t.js',
            '065_targeting_array_offset.t.js',
            '066_text_present.t.js',
            '067_editable_nodes.t.js',
            {
                url              : '068_activeElement.t.js',
                autoCheckGlobals : false
            },
            '069_waitfor_stable_target.t.js',
            '070_chaining_with_actions.t.js',
            '070_action_shortcuts.t.js',
            '071_chain_click.t.js',
            '072_chaining_arguments.t.js',
            '074_chaining_eval.t.js',
            '075_action_trigger_method_call.t.js',
            '076_monkey_test.t.js',
            {
                url             : '077_monkey_anchor.t.js',
                pageUrl     : 'html-pages/monkey_anchor.html'
            },
            '078_text_equals_pseudo.t.js',
            '079_mousedown.t.js',
            '081_select_element_interaction.t.js'
        ]
    },
    {
        group : 'Utility classes',
        sandbox : false,
        items : [
            'util/100_util_queue.t.js',
            {
                url      : 'util/110_util_serializer.t.js',
                // need to reach the "done" call, since in FF, serializing the `window.location` property
                // may cause a silent and undetectable exception
                needDone : true
            },
            'util/120_util_xml_node.t.js',
            'util/130_rect.t.js'
        ]
    },
    {
        group    : 'Ext 4 only',
        preloads : extJSConfigs[ '4.2.2' ],
        items    : [
            {
                pageUrl : '500_extjs_observable_hostpage.html',
                url         : '500_extjs_observable_hostpage.t.js'
            }
        ]
    },

    $.map(extJSConfigs, function(value, key) {

        return {
            group   : 'Ext JS ' + key,
            preload : value,

            innerHtmlHead   : key == '6.0.1' ? '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">' : '',

            items   : [
                '500_extjs_observable.t.js?' + key,
                {
                    url         : '501_extjs_combo_autocomplete.t.js?' + key,
                    speedRun    : false,
                    runCore     : 'sequential'
                },
                '502_extjs_component.t.js?' + key,
                '502_extjs_wait_for_cq.t.js?' + key,
                '502_extjs_component_click.t.js?' + key,
                '503_extjs_dataview.t.js?' + key,
                '504_extjs_element.t.js?' + key,
                '505_extjs_grid.t.js?' + key,
                '506_extjs_observable.t.js?' + key,
                '507_form_checkbox.t.js?' + key,
                '509_waitfor_animations.t.js?' + key,
                '510_extjs_require_singleton.t.js?' + key,
                '511_extjs_ajax.t.js?' + key,
                {
                    preload : [
                        '../../extjs-5.1.0/build/ext-all-debug.js'
                    ],
                    url     : '512_extjs_overrides.t.js?' + key
                },
                '513_action_target.t.js?' + key,
                //'514_fileupload.t.js?' + key,
                '530_extjs_composite_query.t.js?' + key,
                '540_extjs_type.t.js?' + key,
                '550_extjs_store.t.js?' + key
            ]
        };
    }),

    {
        group            : 'Ext JS 5 Tests',
        autoCheckGlobals : false,
        preload          : extJSConfigs[ '5.1.0' ],
        items            : [
            '500_extjs_observable.t.js?Ext5'
        ]
    },
    /webkit/i.test(navigator.userAgent) || $.browser.msie && Number($.browser.version) >= 10 ?
        [
            {
                group               : 'Ext JS 5 Touch Events',
                autoCheckGlobals    : false,
                preload             : extJSConfigs[ '5.1.0' ],
                items               :  [
    //                'ext5_touch_events/010_same_point_taps.t.js',
    //                'ext5_touch_events/020_pinch.t.js'
                ]
            },
            {
                group               : 'Ext JS 6 Modern',
                autoCheckGlobals    : false,
                preload             : [
                    '../../extjs-6.0.1/build/modern/theme-triton/resources/theme-triton-all.css',
                    '../../extjs-6.0.1/build/ext-modern-all-debug.js',
                    '../../extjs-6.0.1/build/modern/theme-triton/theme-triton.js'
                ],
                items               :  [
                    'ext6-modern/form-submit.t.js',
                    'ext6-modern/text-field.t.js'
                ]
            }
        ]
    :
        [],
    {
        group               : 'Siesta UI',
        pageUrl         : 'siesta_ui/601_siesta_ui.html',
        loaderPath          : 'inherit',
        autoCheckGlobals    : false,

        items   : [
            'siesta_ui/601_siesta_ui_line_number.t.js',
            'siesta_ui/602_siesta_ui_recursive_self.t.js',
            'siesta_ui/603_siesta_ui.t.js',
            'siesta_ui/604_siesta_ui2.t.js',
            'siesta_ui/605_siesta_ui_nbr_layouts.t.js',
            'siesta_ui/606_siesta_preload_404.t.js',
            $.browser.msie ? null : 'siesta_ui/607_ghost_cursor.t.js', // we disable the ghost cursor in IE
            'siesta_ui/608_keep_assertions.t.js',
            'siesta_ui/609_forced_iframe.t.js',
            'siesta_ui/610_cleanup_with_subtests.t.js',
            'siesta_ui/611_component_inspector2.t.js',
            'siesta_ui/612_domcontainer_sizing.t.js',
            {
                url      : 'siesta_ui/613_version_check.t.js',
                requires : ['Ext.ux.ajax.SimManager']
            },
            {
                url      : 'siesta_ui/614_version_check2.t.js',
                requires : ['Ext.ux.ajax.SimManager']
            },
            'siesta_ui/615_launch_same_test_repeatedly.t.js',
            'siesta_ui/616_waitfor_indication.t.js',
            'siesta_ui/617_row_statuses.t.js',
            {
                url     : 'siesta_ui/618_settings_menu.t.js',
                runCore : 'sequential'
            },
            'siesta_ui/619_play_buttons.t.js',
            'siesta_ui/620_test_buttons.t.js',
            {
                pageUrl : 'siesta_ui/siesta_ui_cov.html',
                url         : 'siesta_ui/621_coverage.t.js'
            },
            {
                pageUrl : '../bin/coverage/',
                url         : 'siesta_ui/622_coverage_html_report.t.js'
            },
            {
                pageUrl : './',
                url         : 'siesta_ui/623_monkey.t.js'
            },
            {
                pageUrl : 'html-pages/monkey_coverage.html',
                url         : 'siesta_ui/623_monkey.t.js?coverage'
            },
            'siesta_ui/624_rerun_hotkey.t.js',
            'siesta_ui/630_fail_for_404.t.js',
            'siesta_ui/640_globals_with_done.t.js'
        ]
    },
    {
        group       : 'Component inspector',
        alsoPreload : [
            '../resources/css/siesta-all.css'
        ],
        items       : [
            '302_component_inspector.t.js',
            '303_component_inspector_html.t.js'
        ]
    },

    // only show/launch sencha touch tests in Webkit & IE >= 10
    /webkit/i.test(navigator.userAgent) || $.browser.msie && Number($.browser.version) >= 10 ?
        {
            group               : 'Sencha Touch Tests',
            testClass           : Class({
                isa     : Siesta.Test.SenchaTouch,
                does    : Siesta.Test.Self
            }),
            preload : [
                "../../sencha-touch-2.3.0/resources/css/sencha-touch.css",
                "../../sencha-touch-2.3.0/sencha-touch-all-debug.js",
                {
                    url         : '../siesta-all.js',
                    instrument  : true
                },
                'lib/Siesta/Test/AssertionsTranslator.js'
            ],
            items               :  [
                navigator.userAgent.match(/Chrome/i) ? null : 'senchatouch/001_basic.js',
                navigator.userAgent.match(/Chrome/i) ? null : 'senchatouch/701_sencha_touch_form.t.js',
                'senchatouch/901_sencha_touch_events.t.js',
                navigator.userAgent.match(/Chrome/i) ? null : 'senchatouch/902_sencha_touch_drag.t.js',
                'senchatouch/903_waitfor_stable_target.t.js?touch',
                'senchatouch/904_waitfor_component.t.js?'
            ]
        }
    :
        [],
    {
        group : 'BDD',
        sandbox : false,
        items : [
            'bdd/010_structure.t.js',
            'bdd/011_before_after_each.t.js',
            'bdd/011_before_after_each_test_instance.t.js',
            'bdd/011_iit.t.js',
            'bdd/020_placeholder.t.js',
            'bdd/030_expectations.t.js',
            'bdd/040_dom_in_subtest.t.js',
            'bdd/050_spies.t.js'
        ]
    },

    // don't run recorder tests in IE, seems the event capturing handlers are not activated for simulated
    // events in it. Probably related to the "simulateEventsWith"
    $.browser.msie ? null : {
        group       : 'Recorder',

        items   : [
            {
                group      : 'Target extractor Ext JS 4',
                preload    : extJSConfigs[ '4.2.2' ],
                loaderPath : { 'Ext.ux' : '../../extjs-4.2.2/examples/ux' },
                items      : getRecorderExtractorTests('ext4').concat(
                    'recorder/target_extractor/016_xdomain_frames.t.js',
                    {
                        alsoPreload : [
                            "../../ExtGantt2.x/resources/css/sch-gantt-all.css",
                            "../../ExtGantt2.x/gnt-all.js"
                        ],
                        url         : 'recorder/target_extractor/1100_gantt_integration_test.t.js'
                    },
                    {
                        autoCheckGlobals : false,
                        pageUrl      : '../../extjs-4.2.2/examples/themes/index.html',
                        preload          : [
                            {
                                url        : '../siesta-all.js',
                                instrument : true
                            },
                            'lib/Siesta/Test/AssertionsTranslator.js'
                        ],
                        url              : 'recorder/target_extractor/005_extjs_components_all.t.js'
                    }
                )
            },
            {
                group      : 'Target extractor Ext JS 5',
                preload    : extJSConfigs[ '5.1.0' ],
                loaderPath : { 'Ext.ux' : '../../extjs-5.1.0/examples/ux' },
                items      : getRecorderExtractorTests('ext5')
            },
            {
                group      : 'Target extractor Ext JS 6',
                preload    : extJSConfigs[ '6.0.1' ],
                loaderPath : { 'Ext.ux' : '../../extjs-6.0.1/packages/ux/src' },
                items      : getRecorderExtractorTests('ext6').concat(
                    {
                        alsoPreload : [
                            '../../ExtScheduler4.x/sch-all-debug.js',
                            '../../ExtScheduler4.x/resources/css/sch-all.css'
                        ],
                        url         : 'recorder/target_extractor/015_scheduler.t.js'
                    }
                )
            },
            {
                group               : 'Recorder UI',
                runCore             : 'sequential',
                alsoPreload         : [ '../resources/css/siesta-all.css' ],
                autoCheckGlobals    : false,
                items               : [
                    'recorder/ui/017_moveCursor.t.js',
                    'recorder/ui/100_recorder_ui.t.js',
                    'recorder/ui/101_eventview_edit_actions.t.js',
                    'recorder/ui/102_eventview_type_column.t.js',
                    'recorder/ui/103_eventview_offset_column.t.js',
                    'recorder/ui/104_eventview_fn.t.js',
                    'recorder/ui/105_eventview_drag.t.js',
                    'recorder/ui/106_eventview_reorder.t.js',
                    'recorder/ui/107_eventview.t.js',
                    'recorder/ui/108_target_editor.t.js',
                    'recorder/ui/109_eventview_target_column.t.js',
                    'recorder/ui/1000_code_generation.t.js'
                ]
            },
            {
                group       : 'Integration tests',
                pageUrl : 'siesta_ui/601_siesta_ui.html',
                items       : [
                    'recorder/integration/200_integration_1.t.js',
                    'recorder/integration/201_target_highlighting.t.js',
                    'recorder/integration/202_text_input.t.js',
                    'recorder/integration/203_add_step.t.js',
                    'recorder/integration/204_hostPage.t.js',
                    'recorder/integration/205_play_single.t.js'
                ]
            },
            {
                group : 'Touch tests',
                items : /webkit/i.test(navigator.userAgent) ?
                    [
                        'recorder/touch/100_touch_components.t.js'
                    ] : []
            },
            {
                group               : 'Monkey tests',
                autoCheckGlobals    : false,
                mouseMovePrecision  : 1000,
                items               : [
                    {
                        pageUrl : '../examples/',
                        url     : 'recorder/monkey/001_monkey.t.js?1'
                    },
                    {
                        pageUrl : '../../ExtGantt4.x/examples/advanced/advanced.html',
                        preload : ['../siesta-all.js'],
                        url     : 'recorder/monkey/001_monkey.t.js?2'
                    },
                    {
                        pageUrl         : '../../ExtGantt4.x/examples/advanced/advanced.html',
                        defaultTimeout  : 80000,
                        separateContext : true,
                        preload         : ['../siesta-recorder.js'],
                        url             : 'recorder/monkey/004_monkey_replay.t.js?1'
                    }
                ]
            },
            'recorder/002_window_resize.t.js',
            'recorder/003_forced_offset.t.js',
            'recorder/004_root_cq_pseudo.t.js',
            'recorder/005_drag_small_distance.t.js',
            'recorder/006_click_target_change.t.js',
            'recorder/007_scrolled_page.t.js'
        ]
    },
    {
        group : 'Harness tests',

        items : [
            'harness/010_preload_hostpageurl.t.js'
        ]
    },
    {
        group : 'ExtJS component tests',

        items : [
            'extjs-component/010_hidden.t.js',
            'extjs-component/011_csq_nested.t.js',
            'extjs-component/012_cq.t.js',
//            // TODO uncomment for native events
//            'extjs-component/013_HTMLEditor.t.js'
            'extjs-component/014_setValue.t.js'
        ]
    }
)

if (window.console && window.console.error) {
    console.error = function (msg) {
        throw msg;
    };

//    console.warn = function(msg) {
//        throw msg;
//    };
}

