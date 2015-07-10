
// NOTE object below must be a valid JSON
window.BookShelf = $.extend(true, window.BookShelf, {
  "config": {
    "layoutSet": "navbar",
    "navigation": [
      {
        "title": "To Read",
        "onExecute": "#LaterList",
        "icon": "bsicon bsicon-toread"
      },
      {
        "title": "Finished",
        "onExecute": "#FinishedList",
        "icon": "bsicon bsicon-finished"
      },
      {
        "title": "Settings",
        "onExecute": "#Settings",
        "icon": "bsicon bsicon-settings"
      }
    ],
    "commandMapping": {
      "ios-header-toolbar": {
        "defaults": {
          "showIcon": false,
          "location": "after"
        },
        "commands": [ {
            "id": "filterBooks"
          }, {
            "id": "applyFilter"
          }, {
            "id": "addBook"
          }, {
            "id": "saveBook"
          }, {
            "id": "editBook"
          }, {
            "id": "saveNotes"
          }, {
            "id": "addTag"
          }, {
            "id": "saveTag"
          }
        ]
      }
    }
  }
});
