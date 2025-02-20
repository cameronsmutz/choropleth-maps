mapboxgl.accessToken = 'pk.eyJ1IjoiY3NtdXR6eSIsImEiOiJjbTFqamx6YjMxMHUwMmpweHFodGljY2J1In0.HMxiHUZ8QXW-J1rPNZgzPg';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 6.5, // starting zoom
        center: [-120.75, 47.4] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/wa-covid-data-102521.geojson');
    let stateData = await response.json();
    map.on('load', function loadingData() {
        map.addSource('stateData', {
    type: 'geojson',
    data: stateData
});

map.addLayer({
    'id': 'stateData-layer',
    'type': 'fill',
    'source': 'stateData',
    'paint': {
        'fill-color': [
            'step',
            ['get', 'fullyVaxPer10k'],
            '#eff3ff',   // stop_output_0
            4000,        // stop_input_0
            '#c6dbef',   // stop_output_1
            4500,        // stop_input_1
            '#9ecae1',   // stop_output_2
            5000,        // stop_input_2
            '#6baed6',   // stop_output_3
            5500,        // stop_input_3
            '#4292c6',   // stop_output_4
            6000,        // stop_input_4
            '#2171b5',   // stop_output_5
            6500,        // stop_input_5
            '#084594',   // stop_output_6
            7000,        // stop_input_6
            "#08306b"    // stop_output_7
        ],
        'fill-outline-color': '#BBBBBB',
        'fill-opacity': 0.7,
    }
});

const layers = [
    '0-39%',
    '40-44%',
    '45-49%',
    '50-54%',
    '55-59%',
    '60-64%',
    '65-69%',
    '70% and more'
];
const colors = [
    '#eff3ff70',
    '#c6dbef70',
    '#9ecae170',
    '#6baed670',
    '#4292c670',
    '#2171b570',
    '#08459470',
    '#08306b70'
];

const legend = document.getElementById('legend');
legend.innerHTML = "<b>Vaccination Rate</b><br>(% of population within county that have COVID vaccine)<br><br>";

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

map.on('mousemove', ({point}) => {
    const county = map.queryRenderedFeatures(point, {
        layers: ['stateData-layer']
    });
    document.getElementById('text-description').innerHTML = county.length ?
        `<h3>${county[0].properties.name}</h3><p><strong><em>${(county[0].properties.fullyVaxPer10k / 100).toFixed(2)}%</strong> of population vaccinated</em></p>` :
        `<p>Hover over a county!</p>`;
});
    });
}

geojsonFetch();