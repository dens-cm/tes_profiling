/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import * as ChakraIcon from '@chakra-ui/icons'
import * as ReactIcons from 'react-icons/hi2'
import { doc, updateDoc } from 'firebase/firestore'
import { firestoreDB } from '../../config/FirebaseConfig'
import { useAuth } from '../../config/Authentication'
import { useNavigate } from 'react-router-dom'

export default function ArchiveAccount({ isOpen, onClose }) {

    const [loading, setLoading] = React.useState(false)
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const handleArchiveAccount = async (userId) => {
        const userDoc = doc(firestoreDB, 'users', userId)
        setLoading(true)

        try {
            await updateDoc(userDoc, { status: 'archive' })
            navigate('/')
        }

        catch (error) {
            console.error("Error:", error)
            setLoading(false)
        }

        finally {
            setLoading(false)
        }
    }

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
            <Chakra.ModalOverlay />
            <Chakra.ModalContent borderRadius='0'>
                <Chakra.ModalHeader display='flex' justifyContent='space-between'>
                    <Chakra.Text w='100%' fontSize='.8vw' fontWeight='700' color='gray.700' display='flex' alignItems='center' textTransform='uppercase'>
                        <Chakra.Text mr='2%'>
                            <ReactIcons.HiArchiveBoxXMark size='1.1vw' />
                        </Chakra.Text>
                        Archive Account
                    </Chakra.Text>
                    <Chakra.IconButton onClick={onClose} h='2vw' bg='#0000' icon={<ChakraIcon.SmallCloseIcon />} />
                </Chakra.ModalHeader>
                <Chakra.ModalBody>
                    <hr />
                    <Chakra.Text m='5% 0 5% 0' fontSize='.9vw' color='gray.800' textAlign='justify'>
                        Are you sure you want to archive this account? Archiving will keep the account active for login purposes but <b>restrict access to certain features</b>.
                        The user will retain their login credentials but won't be able to access specific functionalities.
                        Only an <b>administrator</b> can reactivate the account from the archives.
                    </Chakra.Text>
                    <hr />
                </Chakra.ModalBody>
                <Chakra.ModalFooter>
                    <Chakra.Button onClick={() => handleArchiveAccount(currentUser.uid)} isDisabled={loading} isLoading={loading} loadingText='please wait..' h='1.9vw' mr='2%' fontSize='.8vw' colorScheme='red' rightIcon={<ReactIcons.HiMiniArchiveBoxXMark />} borderRadius='0' _hover={{ border: '.1vw solid red', bg: 'white', color: 'red' }}>Confirm</Chakra.Button>
                    <Chakra.Button onClick={onClose} h='1.9vw' fontSize='.8vw' colorScheme='blue' borderRadius='0' _hover={{ border: '.1vw solid blue', bg: 'white', color: 'blue' }}>Cancel</Chakra.Button>
                </Chakra.ModalFooter>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
