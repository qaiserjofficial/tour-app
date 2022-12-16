/* eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicWpjb2RlciIsImEiOiJjbGJsdm5xbTYwYmhuM29xeDAwMm84czI5In0.VBcFwgo8IfyRKjZba0LFZA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/qjcoder/clbqmh7sa000u14rvun1h1w0m',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // intreactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 15,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>${loc.description}</p>`)
      .addTo(map);
    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
