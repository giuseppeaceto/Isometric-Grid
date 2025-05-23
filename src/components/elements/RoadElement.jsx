import IsometricElement from './IsometricElement';

/**
 * Road element for the isometric scene
 * @param {Object} props - Component props
 */
export default function RoadElement({
  id,
  position,
  rotation = 0,
  scale = 1,
  ...props
}) {
  return (
    <IsometricElement
      id={id}
      type="road"
      position={position}
      rotation={rotation}
      scale={scale}
      size={{ width: 64, height: 32 }}
      imageUrl="/assets/elements/road.png"
      backgroundColor="rgba(80, 80, 80, 0.8)"
      {...props}
    />
  );
}