import IsometricElement from './IsometricElement';

/**
 * Building element for the isometric scene
 * @param {Object} props - Component props
 */
export default function BuildingElement({
  id,
  position,
  rotation = 0,
  scale = 1,
  ...props
}) {
  return (
    <IsometricElement
      id={id}
      type="building"
      position={position}
      rotation={rotation}
      scale={scale}
      size={{ width: 128, height: 128 }}
      imageUrl="/assets/elements/building.png"
      backgroundColor="rgba(200, 200, 200, 0.8)"
      {...props}
    />
  );
}