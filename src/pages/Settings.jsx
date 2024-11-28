import React from 'react'
import * as Chakra from '@chakra-ui/react'
import * as ReactIcons from 'react-icons/hi2'
import { SettingsIcon } from '@chakra-ui/icons'
import { TiHome } from "react-icons/ti"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../config/Authentication'
import useFetchUserData from '../hooks/data/userData'
import ArchiveAccount from '../components/modal/ArchiveAccount'
import Toast from '../components/Toast'

export default function Settings() {

    const emailRef = React.useRef()
    const passwordRef = React.useRef()
    const confirmPasswordRef = React.useRef()
    const navigate = useNavigate()
    const { currentUser, updateEmail, updatePassword } = useAuth()
    const { archive } = useFetchUserData(currentUser)
    const [loading, setLoading] = React.useState(false)
    const showToast = Toast()
    const { isOpen, onOpen, onClose } = Chakra.useDisclosure()
    const [isEmailChanged, setIsEmailChanged] = React.useState(false)
    const [newPassword, setNewPassword] = React.useState('')

    React.useEffect(() => {
        const newEmail = emailRef.current?.value || ''
        setIsEmailChanged(newEmail !== currentUser.email)
    }, [currentUser.email])

    function handlePasswordChange(e) {
        setNewPassword(e.target.value)
    }

    async function handleEmailUpdate(newEmail) {
        await updateEmail(newEmail)
        await currentUser.sendEmailVerification()
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value && passwordRef.current.value.length < 6) {
            return showToast({ description: "Password must be at least 6 characters long!", variant: 'top-accent', status: "error", position: 'top' })
        }

        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            return showToast({ description: "Passwords do not match!", variant: 'top-accent', status: "error", position: 'top' })
        }

        const promises = []
        setLoading(true)

        if (emailRef.current.value !== currentUser.email) {
            promises.push(handleEmailUpdate(emailRef.current.value))
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            showToast({ description: "Updated successfully!", variant: 'top-accent', status: "success", position: 'top' })
            passwordRef.current.value = ''
            confirmPasswordRef.current.value = ''
            setNewPassword('')
        })
            .catch((error) => {
                showToast({ description: `Failed to update account: ${error}`, variant: 'top-accent', status: "error", position: 'top' })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function handleEmailChange(e) {
        const newEmail = e.target.value
        setIsEmailChanged(newEmail !== currentUser.email)
    }


    React.useEffect(() => {
        if(archive) {
            navigate('/')
        }
    }, [archive, navigate])

    return (
        <Chakra.Box w='100%' h='100%' p='1% 35% 1% 35%' bg='#f0f1f5' display='flex' flexDirection='column' overflow='auto'>
            <Chakra.Box w='100%' p='4%' bg='white' display='flex' flexDirection='column' justifyContent='space-between'>
                <Chakra.Box w='100%' mb='1%' display='flex' alignItems='center'>
                    <Chakra.Box w='50%' display='flex' alignItems='center'>
                        <SettingsIcon fontSize='.9vw' mr='1%' />
                        <Chakra.Text fontSize='1vw' fontWeight='700' color='gray.600'>Settings</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box w='50%' display='flex' alignItems='center' justifyContent='right'>
                        <Chakra.IconButton onClick={() => navigate('/')} fontSize='1vw' color='teal' bg='#0000' icon={<TiHome />} borderRadius='0' />
                    </Chakra.Box>
                </Chakra.Box>
                <hr />
                <Chakra.Box w='100%' h='100%' p='2% 5% 0 5%' display='flex' flexDirection='column' alignItems='center' overflow='auto'>
                    <Chakra.Box w='100%' display='flex' alignItems='center'>
                        <Chakra.Box w='100%'>
                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <Chakra.Text mt='2%' fontSize='.9vw' fontWeight='500'>*Update Email Address</Chakra.Text>
                                <Chakra.Box pl='1.5%'>
                                    <Chakra.Text mt='.5%' fontStyle='italic' fontSize='.9vw' fontWeight='400'>Please ensure your email address is up-to-date
                                        to receive important account-related information.
                                        You can update it by entering a new email below.
                                    </Chakra.Text>
                                    <Chakra.Text mt='2.5%' fontSize='.9vw' fontWeight='500'>Email:</Chakra.Text>
                                    <Chakra.InputGroup h='2.2vw' mb='8%'>
                                        <Chakra.Input h='100%' type='email' required ref={emailRef} defaultValue={currentUser.email} onChange={handleEmailChange} variant='filled' fontSize='.9vw' fontWeight='500' borderRadius='0' placeholder='New email address'></Chakra.Input>
                                        <Chakra.InputRightElement h='100%' fontSize='.9vw'>
                                            <ReactIcons.HiEnvelope />
                                        </Chakra.InputRightElement>
                                    </Chakra.InputGroup>

                                    <Chakra.Text mb='1%' fontSize='.9vw' fontWeight='700'>*Change password</Chakra.Text>
                                    <hr />

                                    <Chakra.Text mt='1.5%' fontSize='.9vw' fontWeight='500'>New password:</Chakra.Text>
                                    <Chakra.InputGroup h='2.2vw'>
                                        <Chakra.Input h='100%' ref={passwordRef} onChange={handlePasswordChange} variant='filled' fontSize='.9vw' fontWeight='500' borderRadius='0' placeholder='Leave blank to keep same'></Chakra.Input>
                                        <Chakra.InputRightElement h='100%' fontSize='.9vw'>
                                            <ReactIcons.HiLockClosed />
                                        </Chakra.InputRightElement>
                                    </Chakra.InputGroup>

                                    <Chakra.Text mt='1.5%' fontSize='.9vw' fontWeight='500'>Confirm new password:</Chakra.Text>
                                    <Chakra.InputGroup h='2.2vw' mb='4%'>
                                        <Chakra.Input h='100%' ref={confirmPasswordRef} type='password' variant='filled' fontSize='.9vw' fontWeight='500' borderRadius='0' placeholder='...'></Chakra.Input>
                                        <Chakra.InputRightElement h='100%' fontSize='.9vw'>
                                            <ReactIcons.HiLockClosed />
                                        </Chakra.InputRightElement>
                                    </Chakra.InputGroup>
                                    <hr />
                                    <Chakra.Box mt='1vw' display='flex' justifyContent='right'>
                                        <Chakra.Button type='submit' isLoading={loading} isDisabled={(!isEmailChanged && !newPassword) || (newPassword && newPassword.length < 6)} h='1.9vw' fontSize='.8vw' colorScheme='blue' rightIcon={<ReactIcons.HiMiniShieldCheck />} borderRadius='0'>Update</Chakra.Button>
                                    </Chakra.Box>
                                </Chakra.Box>
                            </form>
                            <Chakra.Button onClick={onOpen} w='100%' h='2vw' fontSize='.8vw' mt='10%' mb='5%' colorScheme='red' leftIcon={<ReactIcons.HiTrash />} borderRadius='0'>Archive Account</Chakra.Button>
                            <hr />
                            <Chakra.Button onClick={() => navigate('/')} w='100%' h='2vw' fontSize='.8vw' mt='5%' colorScheme='teal' leftIcon={<TiHome />} borderRadius='0'>Back</Chakra.Button>
                        </Chakra.Box>
                    </Chakra.Box>

                </Chakra.Box>
            </Chakra.Box>
            <ArchiveAccount isOpen={isOpen} onClose={onClose} />
        </Chakra.Box>
    )
}
