import styles from "./CategoryFilter.module.css"

type CategoryFilterProps = {
    categories: string[]
    setCategory: (category: string) => void
    activeCategory: string
}

export default function CategoryFilter({
    categories,
    setCategory,
    activeCategory
}: CategoryFilterProps) {
    return (
        <div className={styles.filtro}>

            {categories.map((cat) => (
                <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`${styles.button} ${
                        cat === activeCategory ? styles.active : ""
                    }`}
                >
                        
                    {cat}
                </button>
            ))}
            
        </div>
    );
}