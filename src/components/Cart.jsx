import { useContext } from "react";
import Modal from "./UI/Modal";
import { CartContext } from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import { UserProgressContext } from "../store/UserProgressContext";

export default function Cart() {

    const cartCtx = useContext(CartContext)

    const userProgresCtx = useContext(UserProgressContext)

    const carrTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

    function handleCloseCart() {
        userProgresCtx.hideCart()
    }

    return (
        <Modal className="cart" open={userProgresCtx.progress === 'cart'}>
            <h2>Your Cart</h2>
            <ul>{cartCtx.items.map(item => <li key={item.id}>{item.name} - {item.quantity}</li>)}</ul>
            <p className="cart-total">{currencyFormatter.format(carrTotal)}</p>
            <p className="modal-actions">
                <Button textOnly onClick={handleCloseCart}>
                    Close
                </Button>
                <Button onClick={handleCloseCart}>
                    Go to Checkout
                </Button>
            </p>
        </Modal>
    )
}