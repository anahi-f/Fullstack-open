const Notification = ({message,type}) => {
    if (!message) return null
    
    const baseStyle = {
        padding: ' 10px 14px',
        borderRadius:6,
        marginBottom:12,
        fontSize:15,
        boxShadow: '0 3px 8px rgba(12, 12, 12, 0.08)',
        maxWidth:600
    } 
    const successStyle = {
        ...baseStyle,
        color: '#2a3b28ff',
        backgroundColor: '#bbf7d0',
        border:'1px solid #86efac'
    }
    const errorStyle = {
        ...baseStyle,
        color: '#813333ff',
        backgroundColor: '#fecaca',
        border: '1px solid #fca5a5'
    }
    const chosen = type=== 'error'? errorStyle:successStyle
    return(
        <div role="status" aria-live="polite" style={chosen}>
            {message}
        </div>
    )
}
export default Notification
