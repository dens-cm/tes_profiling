import React from 'react'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from '../../config/FirebaseConfig'

const useFetchCertificates = (currentUser) => {
    const [certificates, setCertificates] = React.useState([])
    const [loadingCertificates, setLoadingCertificates] = React.useState(false)
    const [refreshTrigger, setRefreshTrigger] = React.useState(false)

    React.useEffect(() => {
        if (!currentUser || !currentUser.uid) return

        const certificatesRef = collection(firestoreDB, `users/${currentUser.uid}/certificates`)
        const q = query(certificatesRef)

        setLoadingCertificates(true)
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const certificateList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setCertificates(certificateList);
                setLoadingCertificates(false)
            },
            (error) => {
                console.error('Error fetching certificates:', error)
                setCertificates([])
                setLoadingCertificates(false)
            }
        )

        return () => unsubscribe()
    }, [currentUser, refreshTrigger])

    const refreshCertificates = () => {
        setRefreshTrigger(prev => !prev)
    }

    return { certificates, loadingCertificates, refreshCertificates }
}

export default useFetchCertificates
