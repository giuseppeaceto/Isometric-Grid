import IsometricElement from './IsometricElement';

/**
 * Park element for the isometric scene
 * @param {Object} props - Component props
 */
export default function ParkElement({
  id,
  position,
  rotation = 0,
  scale = 1,
  ...props
}) {
  return (
    <IsometricElement
      id={id}
      type="park"
      position={position}
      rotation={rotation}
      scale={scale}
      size={{ width: 96, height: 96 }}
      imageUrl="/assets/elements/park.png"
      backgroundColor="rgba(120, 200, 120, 0.8)"
      {...props}
    />
  );
}