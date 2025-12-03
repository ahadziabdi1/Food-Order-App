export default function Input({ label, id, ...props }) {
    return (
        <p className="contro">
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} {...props} />
        </p>
    )
}