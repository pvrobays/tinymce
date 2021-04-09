﻿import { ApproxStructure, Assertions } from '@ephox/agar';
import { after, before, describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/mcagar';
import { Insert, Remove, SugarBody, SugarElement } from '@ephox/sugar';

import Editor from 'tinymce/core/api/Editor';
import Theme from 'tinymce/themes/silver/Theme';

describe('browser.tinymce.themes.silver.editor.SilverFixedToolbarContainerPriorityTest', () => {
  const toolbar: SugarElement<HTMLDivElement> = SugarElement.fromHtml('<div style="margin: 50px 0;"></div>');
  const toolbarWithId: SugarElement<HTMLDivElement> = SugarElement.fromHtml('<div id="toolbar" style="margin: 50px 0;"></div>');
  before(() => {
    Insert.append(SugarBody.body(), toolbar);
    Insert.append(SugarBody.body(), toolbarWithId);
  });

  after(() => {
    Remove.remove(toolbar);
  });

  const hook = TinyHooks.bddSetup<Editor>({
    inline: true,
    fixed_toolbar_container_target: toolbar.dom,
    fixed_toolbar_container: '#toolbar',
    menubar: 'file',
    toolbar: 'undo bold',
    base_url: '/project/tinymce/js/tinymce'
  }, [ Theme ]);

  it('Check basic structure', () => {
    const editor = hook.editor();
    editor.setContent('fixed_toolbar_container test');
    editor.focus();
    Assertions.assertStructure(
      'Container structure',
      ApproxStructure.build((s, str, arr) => s.element('div', {
        classes: [],
        children: [
          s.element('div', {
            classes: [ arr.has('tox'), arr.has('tox-tinymce'), arr.has('tox-tinymce-inline') ],
            children: [
              s.element('div', {
                classes: [ arr.has('tox-editor-container') ],
                children: [
                  s.element('div', {
                    classes: [ arr.has('tox-editor-header') ],
                    children: [
                      s.element('div', {
                        classes: [ arr.has('tox-menubar') ],
                        attrs: { role: str.is('menubar') },
                        children: [
                          s.element('button', {
                            classes: [ arr.has('tox-mbtn'), arr.has('tox-mbtn--select') ],
                            children: [
                              s.element('span', {
                                classes: [ arr.has('tox-mbtn__select-label') ],
                                html: str.is('File')
                              }),
                              s.element('div', {
                                classes: [ arr.has('tox-mbtn__select-chevron') ],
                                children: [
                                  s.element('svg', {})
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                      s.element('div', {
                        classes: [ arr.has('tox-toolbar-overlord') ],
                        attrs: { role: str.is('group') },
                        children: [
                          s.element('div', {
                            classes: [ arr.has('tox-toolbar__primary') ],
                            attrs: { role: str.is('group') },
                            children: [
                              s.element('div', {
                                classes: [ arr.has('tox-toolbar__group') ],
                                children: [
                                  s.element('button', {
                                    classes: [ arr.has('tox-tbtn'), arr.not('tox-btn--enabled') ],
                                    attrs: {
                                      'aria-label': str.is('Undo')
                                    }
                                  }),
                                  s.element('button', {
                                    classes: [ arr.has('tox-tbtn'), arr.not('tox-btn--enabled') ],
                                    attrs: {
                                      'aria-label': str.is('Bold')
                                    }
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              s.element('div', {
                classes: [ arr.has('tox-throbber') ]
              })
            ]
          }),
          s.element('div', {
            classes: [ arr.has('tox'), arr.has('tox-silver-sink'), arr.has('tox-tinymce-aux') ]
          })
        ]
      })),
      toolbarWithId
    );

    Assertions.assertStructure(
      'empty structure',
      ApproxStructure.build((s) => s.element('div', {
        classes: [],
        children: []
      })),
      toolbar
    );
  });
});
