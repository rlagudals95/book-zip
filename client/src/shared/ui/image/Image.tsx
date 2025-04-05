type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export default function Image({ src, alt, width, height, ...props } : ImageProps) {
  //TODO: 추후 NextImage 로직 추가
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={width} height={height} {...props} />;
};
