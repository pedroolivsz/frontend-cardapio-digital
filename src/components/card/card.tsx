import "./card.css"
interface CardProps {
    price: string,
    title: string,
    image: string
    onEdit: () => void
    onDelete: () => void
}

export function Card({price, image, title, onEdit, onDelete} : CardProps) {
    return (
        <div className="card">
            <img src={image}/>
            <h2 className="card-title">{title}</h2>
            <p className="card-price"><b>Valor: </b>{price}</p>
            <button onClick={onEdit}>
                Editar
            </button>
            <button onClick={onDelete}>
                Deletar
            </button>
        </div>
    )
}