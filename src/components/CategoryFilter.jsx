export default function CategoryFilter({ categories, setCategories }) {
    return (
        <div className="filtro">
            <button onClick={() => setCategories("Todas")}>
                Todas
            </button>

            {categories.map((cat, index) => (
                <button key={index} onClick={() => setCategories(cat)}>
                    {cat}
                </button>
            ))}
        </div>
    );
}