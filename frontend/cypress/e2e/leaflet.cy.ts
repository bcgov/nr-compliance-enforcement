import { MapOptions } from "leaflet";

describe("Test Mapping functionality", () => {
  before(function () {
    cy.viewport("macbook-16");
    cy.kcLogin();
  });

  it("tests basic leaflet functions", function () {
    // Create the map
    cy.visit("/", {
      onLoad: (contentWindow: any) => {
        const { L } = contentWindow;

        const options: MapOptions = {
          center: { lat: 40.731253, lng: -73.996139 },
          zoom: 10,
        };

        // Create the map
        const map = L.map("root", options);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '<a href="http://mascots.work">Mascots</a>',
        }).addTo(map);

        map.zoomIn();
        map.zoomOut();

        contentWindow.map = map;
      },
    });
  });
});
