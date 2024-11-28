/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { auth } from '../config/FirebaseConfig'
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'

const AuthContext = React.createContext()

export function useAuth() {
    return React.useContext(AuthContext)
}

export function Authentication({ children }) {
    const [currentUser, setCurrentUser] = React.useState()
    const [loading, setLoading] = React.useState(true)

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function reAuthenticate(password) {
        const credential = EmailAuthProvider.credential(currentUser.email, password)
        return reauthenticateWithCredential(currentUser, credential)
    }

    function logout() {
        return auth.signOut()
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        reAuthenticate,
        updateEmail,
        updatePassword,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
