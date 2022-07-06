# Earthquake-API

Allows querying all earthquakes over the past 7 days and prints the place of all earthquakes with a magnitude over 4.5 for the last day in order of highest to lowest magnitude.

Allows querying all earthquakes for the last 30 days and prints each state or country along with the number of earthquakes that occurred.

Allows the input of a code and provides the user with the correct URL for the detail geojson dataset.

## Installation

Pull Docker image:

```bash
docker pull dylanallgood/earthquake-app:quake
```

Because the app is waiting for some input, start the container using:

```bash
docker run -it --rm quake
```

...that way stdin and stderr will forward to your terminal.
