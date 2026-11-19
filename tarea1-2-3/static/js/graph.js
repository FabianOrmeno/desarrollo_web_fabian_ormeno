const graph_per_day = (series) => {
  var datos = {};
  datos.data = series;

  var firstDay = series.length > 0 ? series[0][0] : new Date().getTime();
  var today = new Date().getTime();
  var day = 24 * 60 * 60 * 1000;
  var month = 30 * day;

  var options = {
    legend: {
      show: false
    },
    lines: {
      show: true
    },
    points: {
      show: true
    },
    grid: {
      hoverable: true
    },
    xaxis: {
      mode: "time",
      timeformat: "%Y-%m-%d",
      max: today,
      panRange: [firstDay - month, today + month],
      zoomRange: [7 * day, today - firstDay + 2 * month]
    },
    yaxis: {
      min: 0,
      tickDecimals: 0,
      zoomRange: false,
      panRange: false
    },
    zoom: {
      interactive: true
    },
    pan: {
      interactive: true
    }
  };
  $.plot("#sightings-per-day", [datos], options);
}

const graph_per_bird = (series) => {
  $.plot('#sightings-per-bird', series, {
    series: {
        pie: {
          show: true,
          label: {
            show: true,
            formatter: function(label, series) {
              return "<div style='text-align:center;'>"
              + label + "<br>"
              + series.data[0][1]
              + "</div>";
            }
          }
        }
    },
    legend: {
        show: false
    },
    zoom: {
      interactive: true
    },
    pan: {
      interactive: true
    }
  });
}

const graph_per_user = (series) => {
  let data = series.map(([comuna, cantidad], index) => {
    return [index, Number(cantidad)];
  });

  let categories = series.map(([comuna]) => {
    return comuna;
  });

  $.plot('#users-per-comuna', [{
    data: data,
    bars: {
      show: true,
      barWidth: 0.6,
      align: 'center'
    }
  }], {
    xaxis: {
      ticks: categories.map(function (comuna, index) {
        return [index, comuna];
      }),
      tickLength: 0
    },
    yaxis: {
      min: 0,
      tickDecimals: 0,
      zoomRange: false,
      panRange: false
    },
    legend: {
      show: false
    },
    zoom: {
      interactive: true
    },
    pan: {
      interactive: true
    }
  });
}

window.addEventListener("load", function () {
  fetch("/graph_data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      return response.json();
    })
    .then((data) => {
      let sightings_per_day = Object.entries(data.sightings_per_day).map(
        ([fecha, cantidad]) => {
          return [
            new Date(fecha).getTime(),
            cantidad
          ];
        }
      );

      // Flot necesita los puntos ordenados cronológicamente.
      sightings_per_day.sort((a, b) => {
        return a[0] - b[0];
      });

      graph_per_day(sightings_per_day);

      let sightings_per_bird = Object.entries(data.sightings_per_bird).map(
        ([especie, cantidad]) => {
          return {
            label: especie,
            data: cantidad
          };
        }
      );

      graph_per_bird(sightings_per_bird);

      let users_per_comuna = Object.entries(data.users_per_comuna).map(
        function ([comuna, cantidad]) {
          return [comuna, Number(cantidad)]
        }
      );

      graph_per_user(users_per_comuna)
    })
    .catch((error) => {
      console.error("Error al cargar los avistamientos:", error);
    });
});
