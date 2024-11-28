import { sendEmailVerification } from 'firebase/auth'

export async function handleRegister(e, emailRef, passwordRef, confirmPasswordRef, setLoading, showToast, signup, navigate) {
    e.preventDefault()
    let message = ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(emailRef.current.value)) {
        message = 'Invalid email address'
        showToast({title: 'Error', description: `${message}`, status: 'warning', variant: 'solid', position: 'top'})
        return
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
        message = 'Password do not match!'
        showToast({title: 'Error', description: `${message}`, status: 'warning', variant: 'solid', position: 'top'})
        return
    }

    if (passwordRef.current.value.length < 6) {
        message = 'Password must be at least 6 characters long'
        showToast({title: 'Error', description: `${message}`, status: 'warning', variant: 'solid', position: 'top'})
        return
    }

    try {
        setLoading(true)
        const userCredential = await signup(emailRef.current.value, passwordRef.current.value)
        const user = userCredential.user
        await sendEmailVerification(user)
        message = 'Registered successfully!'
        showToast({title: 'Success', description: `${message}`, status: 'success', variant: 'solid', position: 'top'})
        navigate('/')
    } 
    
    catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            message = 'This email is already in use'
            showToast({title: 'Error', description: `${message}`, status: 'error', variant: 'solid', position: 'top'})
        } 
        
        else {
            message = 'Failed to create an account'
            showToast({title: 'Error', description: `${message}`, status: 'error', variant: 'solid', position: 'top'})
        }
    } 
    
    finally {
        setLoading(false)
    }
}