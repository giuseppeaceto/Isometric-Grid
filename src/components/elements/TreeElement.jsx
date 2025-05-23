import IsometricElement from './IsometricElement';

/**
 * Tree element for the isometric scene
 * @param {Object} props - Component props
 */
export default function TreeElement({
  id,
  position,
  rotation = 0,
  scale = 1,
  ...props
}) {
  return (
    <IsometricElement
      id={id}
      type="tree"
      position={position}
      rotation={rotation}
      scale={scale}
      size={{ width: 64, height: 96 }}
      imageUrl="/assets/elements/tree.png"
      backgroundColor="rgba(100, 200, 100, 0.8)"
      {...props}
    />
  );
}