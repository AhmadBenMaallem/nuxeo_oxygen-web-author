(function () {
  class InsertColorTagAction extends sync.actions.AbstractAction {
    constructor(editor) {
      super();
      this.editor = editor;
      this.iconDiv_ = null;
    }

    /** @override */
    getDisplayName() {
      return "Insérer couleur";
    }


    generateColorGrid(palette) {

      const colorsContainer = document.createElement('div');
      colorsContainer.style.display = 'grid';
      colorsContainer.style.gridTemplateColumns = 'repeat(4, 30px)';
      colorsContainer.style.gap = '4px';

      const steps = [0, 128, 255];
      steps.forEach(r => {
        steps.forEach(g => {
          steps.forEach(b => {
            const color = `rgb(${r},${g},${b})`;
            const btn = document.createElement("button");
            btn.style.backgroundColor = color;
            btn.style.width = "20px";
            btn.style.height = "20px";
            btn.style.margin = "0";
            btn.style.padding = "0";
            btn.style.cursor = "pointer";
            btn.style.border = "1px solid #ccc";
            btn.onclick = () => {
              document.body.removeChild(palette);
              this.editor.getActionsManager().invokeOperation('ro.sync.ecss.extensions.commons.operations.ToggleSurroundWithElementOperation', {
                "element": `<color xmlns="http://www.grouperf.com" value="${color}"/>`,
                "schemaAware": "true"
              });
            };
            colorsContainer.appendChild(btn);
          });
        });
      });
      palette.appendChild(colorsContainer);
    }



    /** @override */
    actionPerformed(callback) {

      const palette = document.createElement('div');
      palette.style.position = 'absolute';
      //palette.style.top = '50%';
      //palette.style.left = '50%';
      const rect = this.iconDiv_.getBoundingClientRect();
      palette.style.left = `${rect.right + 30}px`;
      palette.style.top = `${rect.top + 135}px`;

      palette.style.transform = 'translate(-50%, -50%)';
      palette.style.background = '#fff';
      palette.style.border = '1px solid #ccc';
      palette.style.padding = '10px';
      palette.style.zIndex = '10000';
      palette.style.display = 'flex';
      palette.style.flexDirection = 'column';
      palette.style.alignItems = 'center';


      this.generateColorGrid.call(this, palette);

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Annuler";
      cancelButton.style.marginTop = "10px";
      cancelButton.style.alignSelf = "flex-end";
      cancelButton.onclick = () => {
        document.body.removeChild(palette);
      };
      palette.appendChild(cancelButton);


      //dialog.show();
      document.body.appendChild(palette);
      callback();
    }



    /** @override */
    renderLargeIcon() {
      this.iconDiv_ = goog.dom.createDom("div", 'ui-action-large-icon');
      goog.style.setStyle(this.iconDiv_, 'backgroundImage', 'url("../plugin-resources/insert-color-tag/palette-de-couleurs-16.png")');
      return this.iconDiv_;
    }
  }

  // Ajouter l'action à la toolbar quand l'éditeur est prêt
  goog.events.listen(workspace, sync.api.Workspace.EventType.EDITOR_LOADED, function (e) {
    const editor = e.editor;
    const actionId = 'insert.color.tag';

    editor.getActionsManager().registerAction(actionId, new InsertColorTagAction(editor));

    goog.events.listen(editor, sync.api.Editor.EventTypes.ACTIONS_LOADED, e => {
      const toolbar = e.actionsConfiguration.toolbars[0];
      if (toolbar && toolbar.name && toolbar.name.toLowerCase() === 'toolbar') {
        toolbar.children.unshift(
          { id: actionId, type: 'action' },
          { type: 'sep' }
        );
      }
    });
  });
})();
