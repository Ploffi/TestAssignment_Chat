import './Skeleton.css';

export function Skeleton({ height }: { height: number }) {
    return <div className="skeleton" style={{ height }} />;
}
