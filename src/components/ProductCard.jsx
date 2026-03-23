export default function ProductCard({ product }) {
    return (
        <div className="card">
            <img src={product.image || "https://via.placeholder.com/300"} alt={product.name} />

            <div className="card-info">

                <h3>
                    {product.name}
                </h3>

                <p className="price">
                    R$ {product.price.toFixed(2)
                }</p>

                <button className="btn-add">
                    + adicionar
                </button>
            </div>
        </div>
    );
}