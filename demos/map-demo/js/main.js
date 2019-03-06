require([
  "esri/views/MapView",
  "esri/WebMap",
  "esri/widgets/Search",
  "esri/widgets/Home",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Feature",
  "dojo/on",
  "dojo/query",
  "dojo/dom-class",
  "dojo/domReady!"
], function (
  MapView, WebMap, Search, Home, BasemapToggle, Feature, on, query, domClass
) {
  window.calcite.modal();

  var webmap = new WebMap({
    portalItem: {
      id: "7eca81856e22478da183da6a33c24dfe"
    }
  });
  var view = new MapView({
    map: webmap,
    container: "viewDiv",
    popup: null,
    padding: {
      left: 300
    }
  });
  // Add the home widget to the View UI
  var home = new Home({
    view: view
  });
  var basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "hybrid"
  });
  view.ui.add(home, "top-left");
  view.ui.add(basemapToggle, "top-right");

  var splashButton = document.createElement("button");
  splashButton.setAttribute("data-modal", "splash");
  splashButton.classList.add("js-modal-toggle", "esri-component", "esri-widget", "esri-widget--button", "esri-icon-description");
  view.ui.add(splashButton, "top-left");

  splashButton.addEventListener("click", function () {
    document.getElementById("myModal").classList.add("is-active");
    /*window.calcite.bus.emit("modal:open", {
      id: "splash"
    });*/
  });

  window.calcite.bus.on("modal:close", function () {
    splashButton.focus();
  });

  // View is ready
  view.when(function () {
    updateUI(view);
    view.watch("widthBreakpoint", function () {
      updateUI(view);
    });

    view.whenLayerView(webmap.layers.getItemAt(0)).then(function (layerView) {
      // data is loaded enable the buttons
      query(".btn-disabled").removeClass("btn-disabled");
      var parks = layerView;
      var search = new Search({
        view: view,
        container: "searchContainer",
        includeDefaultSources: false,
        sources: [{
          featureLayer: layerView.layer,
          placeholder: "Enter Park Name",
          searchFields: ["NAME", "Address"],
          suggestionTemplate: "{NAME}: {Address}",
          suggestionsEnabled: true
        }]
      });
      var detailContainer = document.getElementById("detailsContainer");
      search.on("search-clear", function () {
        detailContainer.innerHTML = null;
      });
      search.on("search-complete", function (results) {
        detailContainer.innerHTML = null;
        var searchResults = results.results;

        searchResults.forEach(function (r) {
          if (r.results) {
            r.results.forEach(function (result) {
              var f = new Feature({
                graphic: result.feature,
                view: view,
                container: document.createElement("div")
              });
              detailContainer.appendChild(f.container);
            });

          }
        });
      });
      on(query(".btn-white"), "click", function () {
        // handle button press
        var pressed = (this.getAttribute("aria-pressed") === "true");
        this.setAttribute("aria-pressed", !pressed);
        var type = this.dataset.feature;
        filterTrailheadTypes(type, parks, !pressed);
      });
    });
  });

  function updateUI(view) {
    var breakpoint = view.widthBreakpoint;
    if (breakpoint === "xsmall" || breakpoint === "small") {
      domClass.add("sidebar", "bottom-panel");
      view.padding = {
        left: 0,
        bottom: 300
      };
    } else {
      domClass.remove("sidebar", "bottom-panel");
      view.padding = {
        left: 300,
        bottom: 0
      };
    }
  }

  function filterTrailheadTypes(type, layerView, enabled) {
    var types = {
      "ada": "ADATrail != 'Not Recommended'",
      "horse": "HorseTrail != 'Not Recommended'",
      "bikes": "BikeTrail = 'Yes'",
      "picnic": "PICNIC = 'Yes'",
      "pets": "TH_LEASH = 'Yes'"
    };

    if (types[type] && enabled) {
      types[type];
      if (layerView.layer.definitionExpression === null) {
        layerView.layer.definitionExpression = types[type];
      } else {
        layerView.layer.definitionExpression += " AND " + types[type];
      }
    } else {
      layerView.layer.definitionExpression = null;
    }
    var detailContainer = document.getElementById("detailsContainer");
    var q = layerView.layer.createQuery();
    q.returnGeometry = true;

    layerView.queryFeatures(q).then(function (queryResults) {

      var results = queryResults.features;
      var count = results.length;
      var selected = [];
      query("[aria-pressed=true]").forEach(function (node) {
        selected.push(node.title);
      });
      document.getElementById("results").innerHTML = selected.length === 0 ? "" : count + " parks have the selected facilities " + selected.join(",");
      detailContainer.innerHTML = null;
      var ul = document.createElement("ul");
      detailContainer.appendChild(ul);
      var highlightHandler = null;
      results.forEach(function (f) {
        var li = document.createElement("li");
        ul.appendChild(li);
        li.addEventListener("click", function () {
          if (highlightHandler) {
            highlightHandler.remove();
          }
          view.goTo(f);
          highlightHandler = layerView.highlight(f);
        });
        var feature = new Feature({
          view: view,
          graphic: f,
          container: document.createElement("div")
        });

        li.appendChild(feature.container);
      });
    });
  }

});
