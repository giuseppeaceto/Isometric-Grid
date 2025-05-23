import BuildingElement from './BuildingElement';
import TreeElement from './TreeElement';
import RoadElement from './RoadElement';
import ParkElement from './ParkElement';
import OfficeBuildingElement from './OfficeBuildingElement';

// Element type to component mapping
export const ELEMENT_TYPES = {
  building: BuildingElement,
  tree: TreeElement,
  road: RoadElement,
  park: ParkElement,
  officeBuilding: OfficeBuildingElement
};

// Element metadata for the palette
export const ELEMENT_METADATA = [
  {
    id: 'building',
    type: 'building',
    name: 'Building',
    description: 'A standard building',
    imageUrl: '/assets/elements/building.png'
  },
  {
    id: 'tree',
    type: 'tree',
    name: 'Tree',
    description: 'A decorative tree',
    imageUrl: '/assets/elements/tree.png'
  },
  {
    id: 'road',
    type: 'road',
    name: 'Road',
    description: 'A road segment',
    imageUrl: '/assets/elements/road.png'
  },
  {
    id: 'park',
    type: 'park',
    name: 'Park',
    description: 'A small park area',
    imageUrl: '/assets/elements/park.png'
  },
  {
    id: 'officeBuilding',
    type: 'officeBuilding',
    name: 'Office Building',
    description: 'A tall office building',
    imageUrl: '/assets/elements/office-building.png'
  }
];

export {
  BuildingElement,
  TreeElement,
  RoadElement,
  ParkElement,
  OfficeBuildingElement
};

// Function to get the appropriate element component by type
export function getElementComponent(type) {
  return ELEMENT_TYPES[type] || BuildingElement;
}