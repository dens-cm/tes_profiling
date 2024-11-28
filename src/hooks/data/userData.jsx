/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from '../../config/FirebaseConfig'
import { useAuth } from '../../config/Authentication'

const useFetchUserData = (currentUser) => {
    const [userData, setUserData] = React.useState(null)
    const [userLoading, setUserLoading] = React.useState(false)
    const [archive, setArchive] = React.useState(false)
    const { logout } = useAuth()

    React.useEffect(() => {
        if (currentUser && currentUser.uid) {
            const docRef = doc(firestoreDB, 'users', currentUser.uid)

            setUserLoading(true)
            const unsubscribe = onSnapshot(
                docRef,
                (doc) => {
                    if (doc.exists()) {
                        const data = doc.data()
                        setUserData(data)
                        setArchive(data?.status === 'archive')
                    }

                    else {
                        setUserData(null)
                        setArchive(false)
                    }

                    setUserLoading(false)
                },
                (error) => {
                    console.error('Error fetching document:', error)
                    setUserData(null)
                    setUserLoading(false)
                    logout()
                }
            )

            return () => unsubscribe()
        }
    }, [currentUser])

    return { userData, userLoading, archive }
}

export default useFetchUserData
