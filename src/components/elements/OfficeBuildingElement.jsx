import IsometricElement from './IsometricElement';

/**
 * Office Building element for the isometric scene
 * @param {Object} props - Component props
 */
export default function OfficeBuildingElement({
  id,
  position,
  rotation = 0,
  scale = 1,
  ...props
}) {
  return (
    <IsometricElement
      id={id}
      type="officeBuilding"
      position={position}
      rotation={rotation}
      scale={scale}
      size={{ width: 128, height: 192 }}
      imageUrl="/assets/elements/office-building.png"
      backgroundColor="rgba(150, 180, 220, 0.8)"
      {...props}
    />
  );
}