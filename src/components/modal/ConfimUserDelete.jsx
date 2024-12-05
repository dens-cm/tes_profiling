/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { HiTrash } from 'react-icons/hi2'
import { doc, deleteDoc, setDoc, getDoc, getDocs, collection  } from 'firebase/firestore'
import { getStorage, ref, deleteObject, listAll } from "firebase/storage"
import { firestoreDB } from '../../config/FirebaseConfig'
import Toast from '../Toast'

export default function ConfimUserDelete({ isOpen, onClose, user }) {

    const [loading, setLoading] = React.useState(false)
    const showToast = Toast()

    const handleDelete = async () => {
        if (!user?.id) return
        setLoading(true)
    
        try {
            const userDocRef = doc(firestoreDB, `users/${user.id}`)
            const storage = getStorage()
            const profileImagePath = `users/${user.id}/profileImage`
            const profileImageRef = ref(storage, profileImagePath)
            const certificateImagePath = `users/${user.id}/certificates/`
            const certificateImageRef = ref(storage, certificateImagePath)
            const userDoc = await getDoc(userDocRef)
    
            if (!userDoc.exists()) {
                throw new Error("User document not found in Firestore.")
            }
    
            const profileImageListResult = await listAll(profileImageRef)
            if (profileImageListResult.items.length > 0) {
                const profileImageDeletePromises = profileImageListResult.items.map((itemRef) => deleteObject(itemRef))
                await Promise.all(profileImageDeletePromises)
            }
    
            const certificateImageListResult = await listAll(certificateImageRef)
            if (certificateImageListResult.items.length > 0) {
                const certificateImageDeletePromises = certificateImageListResult.items.map((itemRef) => deleteObject(itemRef))
                await Promise.all(certificateImageDeletePromises)
            }
    
            if (certificateImageListResult.prefixes.length > 0) {
                for (const prefix of certificateImageListResult.prefixes) {
                    const subfolderRef = ref(storage, prefix)
                    const subfolderListResult = await listAll(subfolderRef)
    
                    const subfolderDeletePromises = subfolderListResult.items.map((itemRef) => deleteObject(itemRef))
                    await Promise.all(subfolderDeletePromises)
                }
            }
    
            const subcollectionNames = ['certificates']
            for (let subcollectionName of subcollectionNames) {
                const subcollectionRef = collection(firestoreDB, `users/${user.id}/${subcollectionName}`)
                const subcollectionDocs = await getDocs(subcollectionRef)
    
                subcollectionDocs.forEach(async (doc) => {
                    await deleteDoc(doc.ref)
                })
            }
    
            await deleteDoc(userDocRef)
            showToast({ description: 'Deleted successfully', variant: 'top-accent', status: "success", position: 'top' })
            onClose()
        } 
        
        catch (error) {
            showToast({ description: `Error deleting user: ${error.message}`, variant: 'top-accent', status: "error", position: 'top' })
    
            try {
                const userDocRef = doc(firestoreDB, `users/${user.id}`)
                await setDoc(userDocRef, user)
                showToast({ description: `Firestore document restored.`, variant: 'top-accent', status: "info", position: 'top' })
            } 
            
            catch (rollbackError) {
                showToast({ description: `Failed to rollback Firestore document: ${rollbackError}`, variant: 'top-accent', status: "error", position: 'top' })
            }
        } 
        
        finally {
            setLoading(false)
        }
    }

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} size='lg'>
            <Chakra.ModalOverlay />
            <Chakra.ModalContent borderRadius='0'>
                <Chakra.ModalHeader display='flex' alignItems='center' justifyContent='space-between'>
                    <Chakra.Text fontSize='1vw' fontWeight='bold' color='gray.600' display='flex' alignItems='center'><Chakra.Text mr='.3vw'><HiTrash /></Chakra.Text>Confirm delete</Chakra.Text>
                    <Chakra.IconButton onClick={onClose} w='1vw' h='2vw' fontSize='1vw' bg='#0000' icon={<SmallCloseIcon />} borderRadius='0' />
                </Chakra.ModalHeader>
                <Chakra.ModalBody>
                    <hr />
                    <Chakra.Text m='5% 0' fontSize='1vw' color='gray.800' textAlign='justify'>
                        Are you sure you want to delete{' '}
                        <Chakra.Text as='b' textTransform='capitalize' display='inline'>
                            {user?.firstName || 'this user'}
                        </Chakra.Text>
                        {' '}'s data? This action is permanent and cannot be undone. Please ensure that you have saved any necessary information before proceeding. <br />
                        <Chakra.Text mt='5%' fontSize='.9vw' fontWeight='500' color='gray.600'><i>Please note that the login credentials associated with this user will also be deleted.</i></Chakra.Text>
                    </Chakra.Text>
                    <hr />
                    <Chakra.Box w='100%' mt='5%' mb='3%' display='flex' justifyContent='right'>
                        <Chakra.Button onClick={handleDelete} isLoading={loading} leftIcon={<HiTrash />} h='1.7vw' fontSize='.8vw' colorScheme='red' borderRadius='0'>Delete</Chakra.Button>
                        <Chakra.Button onClick={onClose} h='1.7vw' ml='1%' fontSize='.8vw' colorScheme='teal' borderRadius='0'>Cancel</Chakra.Button>
                    </Chakra.Box>
                </Chakra.ModalBody>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
