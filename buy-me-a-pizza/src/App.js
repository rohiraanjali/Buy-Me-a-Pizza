import React from "react";
import "./App.css"
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api"
import mapStyles from "./mapStyles";
import {formatRelative} from "date-fns"

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const libraries = ["places"]
const mapContainerStyle = {
  width: "100vw",
  height: "100vh"
}

const center = {
  lat: 20.593683,
  lng: 78.962883
}

const options = {
  styles: mapStyles
}

export default function App() {
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: "AIzaSyA_1zYikaQXeyQ9c3DByt4cTq0hV5SnfXg",
    
    libraries,
  })

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      }
    ])
  }, [])

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, [])

  if(loadError) return "Error loading Maps";
  if(!isLoaded) return "Loading Maps";
  return <div>
    <Search />
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center} options={options}
    onClick={onMapClick}
    onLoad={onMapLoad}

    >
      {markers.map((marker) => (
        <Marker 
        key={marker.time.toISOString()}
        position={{lat: marker.lat, lng: marker.lng}}
        onClick={() => {
          setSelected(marker);
        }}
        />
      ))}

      {selected ? (
        <InfoWindow
        position={{lat: selected.lat, lng: selected.lng}}
        onCloseClick={() => {
          setSelected(null); 
        }}
        >
          <div>
            <h3>Location Spotted</h3>
            <p>Spotted {formatRelative(selected.time, new Date())}</p>
          </div>
        </InfoWindow>
      ): null}
    </GoogleMap>
  </div>
}

function Search() {
  const {
    ready,
    value,
    suggestions: {status, data},
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {lat: () => 20.593683, lng: () => 78.962883},
      radius: 200 * 1000,
     },
  })
return (
  <div className="searchbox">
  <Combobox onSelect={(address) => {
    console.log(address);
  }}>

<ComboboxInput value={value} onChange={(e) => {
  setValue(e.target.value)
}}
  disabled={!ready}
  placeholder="Enter an address"
/>
  </Combobox>
  </div>

)
}