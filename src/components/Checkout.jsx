import { useContext } from "react";
import Modal from "./UI/Modal";
import { CartContext } from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { UserProgressContext } from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function Checkout() {

    const cartCtx = useContext(CartContext)

    const userProgressCtx = useContext(UserProgressContext)

    const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp('http://localhost:5050/orders', requestConfig)

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

    function handleClose() {
        userProgressCtx.hideCheckout()
    }

    function handleFinish() {
        userProgressCtx.hideCheckout()
        cartCtx.clearCart()
        clearData()
    }

    function handleSubmit(event) {
        event.preventDefault()

        const fd = new FormData(event.target)
        const customerData = Object.fromEntries(fd.entries())

        sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        )
    }

    let actions = (
        <>
            <Button type="button" textOnly onClick={handleClose}>
                Close
            </Button>
            <Button>
                Submit Order
            </Button>
        </>
    )

    if (isSending) {
        actions = <p>Sending order data...</p>
    }

    if (data && !error) {
        return (
            <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
                <h2>Success!</h2>
                <p>Your order was submitted successfully.</p>
                <p>We will get back to you with more details via email within the next few minutes.</p>
                <div className="modal-actions">
                    <Button onClick={handleFinish}>
                        Okay
                    </Button>
                </div>
            </Modal>
        )
    }

    return (
        <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
                <Input label="Full Name" type="text" id="name" name="name" />
                <Input label="Email" type="email" id="email" name="email" />
                <Input label="Street" type="text" id="street" name="street" />
                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code" name="postal-code" />
                    <Input label="City" type="text" id="city" name="city" />
                </div>
                {error && <Error title="Failed to submit order" message={error} />}
                <div className="modal-actions">
                    {actions}
                </div>
            </form>
        </Modal>
    )
}