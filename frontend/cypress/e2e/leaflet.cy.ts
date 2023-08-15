import { MapOptions } from "leaflet";

describe("Test Mapping functionality", () => {
  before(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
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

        // add a marker to the map
        L.marker([50.1705571, -115.6849567]).addTo(map);

        contentWindow.map = map;
      },
    });
    cy.verifyMapMarkerExists();
  });
});