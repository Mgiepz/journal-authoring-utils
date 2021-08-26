Hooks.on("init", () => {
  CONFIG.TinyMCE.toolbar = CONFIG.TinyMCE.toolbar += ' removeLinebreaks';
  CONFIG.TinyMCE.setup = function (editor) {

    var doFormatting = function (func) {
      var htmlSource = editor.selection.getContent();
      var tree = $("<div>" + htmlSource + "</div>");
      tree = func(tree);
      editor.execCommand('mceReplaceContent', false, tree.html());
    }

    var removeLinebreaks = function (tree) {
      tree.find('p').contents().unwrap().wrapAll('<p>');
      return tree;
    };

    var formatFluffText = function (tree) {
      var isReadOrParaphrase = false;
      // Zum vorlesen...
      tree.find('p').each(function (index) {
        if (index == 0 && $(this).text().indexOf("Zum Vorlesen oder Nacherzählen") >= 0) {
          $(this).wrapInner("<strong />");
          isReadOrParaphrase=true;
          return true;
        } else if (index == 0) {
          return false;
        }
        $(this).wrapInner("<em />");
      });

      if(isReadOrParaphrase){
        console.log("read or pa");
        tree.prepend( "<hr />").append("<hr />");
      }

      tree.find('ul').addClass('dsalist');

      return tree;
    };

    editor.addShortcut(
      'alt+y', 'Remove Linebreaks.', function () {
        doFormatting(formatFluffText);
      });

    editor.addShortcut(
      'alt+x', 'Format Flufftext.', function () {
        doFormatting(removeLinebreaks);
      });

    editor.ui.registry.addMenuButton('removeLinebreaks', {
      icon: 'plus',
      fetch: function (callback) {
        var items = [
          {
            type: 'menuitem',
            text: 'Remove Linebreaks',
            shortcut: 'alt+y',
            onAction: function () {
              removeLinebreaks();
            }
          }
        ];
        callback(items);
      }
    });

  };

});


