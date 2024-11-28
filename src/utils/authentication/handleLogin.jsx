export async function handleLogin({e, emailRef, passwordRef, login, navigate, setLoading, showToast }) {
    e.preventDefault()
    let message = ''

    try {
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        showToast({title: 'Success', description: `Login successfully`, status: 'success', variant: 'solid', position: 'top'})
        navigate("/")
    } 
    
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            message = "No account found with this email"
            showToast({title: 'Error', description: `${message}`, status: 'warning', variant: 'solid', position: 'top'})
        }
        
        else if (error.code === 'auth/wrong-password') {
            message = "Incorrect password"
            showToast({title: 'Error', description: `${message}`, status: 'error', variant: 'solid', position: 'top'})
        } 
        
        else if (error.code === 'auth/too-many-requests') {
            message = "Account temporarily disabled due to failed logins. Reset password or try later."
            showToast({title: 'Failed', description: `${message}`, status: 'error', variant: 'solid', position: 'top'})
        } 
        
        else {
            message = "An error occurred"
            showToast({title: 'Failed', description: `${message}`, status: 'warning', variant: 'solid', position: 'top'})
        }
    } 
    
    finally {
        setLoading(false)
    }
}