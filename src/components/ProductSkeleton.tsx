import styles from "./ProductSkeleton.module.css"

type ProductSkeletonProps = {
    count?: number
}

export default function ProductSkeleton({ count = 1 }: ProductSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={styles.cardSkeleton}>
                <div className={styles.skeletonImg}></div>

                <div className={styles.cardInfo}>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonTextSmall}></div>
                </div>
                </div>
            ))}
        </>
    )
}