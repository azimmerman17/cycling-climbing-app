import Container from 'react-bootstrap/Container'
import * as L from "leaflet";
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { Polyline } from 'react-leaflet/Polyline'
import { Popup } from 'react-leaflet/Popup'
import { useMap } from 'react-leaflet/hooks'
import polyline from '@mapbox/polyline'
// Build the polyline of the segement, make orginal zoom dynamic to the content

const SegmentMap = ({ start, end, map }) => {
  const stravaPolyline = map.polyline
  // Creating the Polyline Coordinates and bounds
  let route = polyline.decode(stravaPolyline)
  
  // center on midpoint
  let center = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
  ]
  //Creating the Icons
  const LeafIcon = L.Icon.extend({
    options: {}
  })

  const endIcon = new LeafIcon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [15, 24.5],
      iconAnchor: [7.2, 24.5],
      shadowSize: [24.5, 24.5]
    });

  const startIcon = new LeafIcon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [15, 24.5],
    iconAnchor: [7.2, 24.5],
    shadowSize: [24.5, 24.5]
  });

  return (
    <Container fluid='md'>
      <MapContainer  id='map' className='tile' bounds={route} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={start} icon={startIcon}></Marker>
        <Polyline positions={route} />
        <Marker position={end} icon={endIcon}></Marker>
      </MapContainer>
    </Container>
  )
}

export default SegmentMap