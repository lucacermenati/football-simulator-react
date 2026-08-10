import clsx from 'clsx';
import style from './image-box.module.scss';
export default function ImageBox({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={clsx(style.imageBox, className)}>
      <img src={src} alt={alt} className={style.image} />
    </div>
  );
}