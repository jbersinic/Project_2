// creating colored world map

var mapConfig = {
  center: [43.28, 72.23],
  zoom: 5
}

var tileURL = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"

var tileConfig = {
maxZoom: 13,
id: "mapbox.streets",
accessToken: API_KEY
}

var geoJSONurl = 'static/data/countries.geo.json'

function colorChooser(countryname,emission) {
  var max,min,emissionvalue=0;
  for (i=0;i<emission.length;i++){
    if (countryname==emission.country[i]){
      max = Math.max(Number(emission.value))
      min = Math.min(Number(emission.value))
      emissionvalue = emission.value[i]
      if (emissionvalue>=min && emissionvalue<(0.20*max)) {return "green"}
      else if (emissionvalue>=(0.20*max) && emissionvalue<(0.40*max)) {return "blue"}
      else if (emissionvalue>=(0.40*max) && emissionvalue<(0.60*max)) {return "yellow"}
      else if (emissionvalue>=(0.60*max) && emissionvalue<(0.80*max)) {return "orange"}
      else {return "red"}
    }
  }
};

function worldmap(emission){

  var map = L.map("map", mapConfig)
  var mapLayer = L.tileLayer(tileURL, tileConfig).addTo(map)
  d3.json(geoJSONurl, function(data) {
    L.geoJSON(data, {
        style: function(feature) {
            return {
                color: "white",
                fillColor: colorChooser(feature.properties.name,emission),
                fillOpacity: 0.5,
                weight: 1.5
              };
        }, 
        onEachFeature : function (feature, layer) {
                layer.on({
                    mouseover: function(event) {
                        layer = event.target, 
                        layer.setStyle({
                            fillOpacity: 0.75
                        });
                    }, 
                    mouseout: function(event) {
                        layer = event.target, 
                        layer.setStyle({
                            fillOpacity: 0.5
                        })
                    }
                });
                layer.bindPopup("<h1>" + feature.properties.name + "</h1><hr><h2>" + feature.id + "</h2>");
        }
    }).addTo(map);
  });

}
worldmap();

// creating world emissions line chart

function worldemissions(emission){

  trace1 ={
    x:emission.year,
    y:emission.value,
    text:emission.value ,
    mode:"scatter",
  } 
  ldata1=[trace1];
  layout1 = {
      title: `${emission.country[0]} ${emission.indicator[0]} v/s Time`,
      showlegend: true,
      height: 600,
      width: 1200,
      xaxis: { 
          title:"Year"
      },
      yaxis: { 
        title:`${emission.indicator[0]} in ${emission.unit[0]} `
    },
    }
  Plotly.newPlot("scatter",ldata1,layout1)

}

// grabbing the Emissions type and year for the world map
d3.select("#year").on("change",grabberhome)
function grabberhome(){
  var fieldInputWorld  = d3.selectAll("#fieldworld").property("value")
  var fieldYear  = d3.selectAll("#year").property("value")
  var urlworldmap = "/api/emission/wholeworld/" + fieldYear + "/" + fieldInputWorld 
  d3.json(urlworldmap).then(function(response) {
    worldemissions(response)
  })
  // grabbing the field for world graph
  var fieldInputWorld  = d3.selectAll("#fieldworld").property("value")
  var urlworldgraph = "/api/emission/World/" + fieldInputWorld
  d3.json(urlworldgraph).then(function(response) {
    worldemissions(response)
})
}